/**
 * SpeedTimer - WCA Standard Speedcubing Timer
 * Features:
 * - WCA 20-move scramble generator
 * - Scramble verification 2D preview (flat net)
 * - Native Web Audio API sound effects (StackMat ready, 8s warning, 12s warning, solve click)
 * - Solve progress trend chart (visualizing Sub-60, Sub-30, Sub-20 goal lines)
 * - Ao5, Ao12, PB, and localStorage persistence
 */

import { Cube } from './cube-engine.js';
import { DiagramGenerator } from './diagram-generator.js';

export class SpeedTimer {
  constructor(elements, options = {}) {
    this.displayEl = elements.display;
    this.scrambleEl = elements.scramble;
    this.scrambleNetEl = elements.scrambleNet;
    this.statusEl = elements.status;
    this.ao5El = elements.ao5;
    this.ao12El = elements.ao12;
    this.bestEl = elements.best;
    this.historyListEl = elements.historyList;
    this.chartCanvas = elements.chartCanvas;

    this.state = 'idle'; // 'idle' | 'holding' | 'ready' | 'inspecting' | 'running'
    this.startTime = 0;
    this.elapsedTime = 0;
    this.timerInterval = null;
    this.holdTimeout = null;

    this.useInspection = options.useInspection ?? true;
    this.useSound = options.useSound ?? true;
    this.inspectionSecondsLeft = 15;
    this.inspectionInterval = null;

    this.audioCtx = null;
    this.currentScramble = '';
    this.solves = this.loadSolves();

    this._bindEvents();
    this.generateNewScramble();
    this.updateStatsDisplay();
  }

  // --- Web Audio Synthesis (0 External Assets) ---
  _getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playBeep(freq = 600, duration = 0.08, type = 'sine') {
    if (!this.useSound) return;
    try {
      const ctx = this._getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  playReadySound() {
    this.playBeep(880, 0.06);
    setTimeout(() => this.playBeep(1200, 0.09), 60);
  }

  playWarningSound() {
    this.playBeep(440, 0.15, 'triangle');
  }

  playPenaltyWarningSound() {
    this.playBeep(330, 0.12, 'sawtooth');
    setTimeout(() => this.playBeep(330, 0.12, 'sawtooth'), 120);
  }

  // --- WCA Scramble Generator ---
  static generateScramble() {
    const faces = ['U', 'D', 'L', 'R', 'F', 'B'];
    const modifiers = ['', "'", '2'];
    const oppositeFaces = {
      'U': 'D', 'D': 'U',
      'L': 'R', 'R': 'L',
      'F': 'B', 'B': 'F'
    };

    const scramble = [];
    let lastFace = '';
    let secondLastFace = '';

    while (scramble.length < 21) {
      const face = faces[Math.floor(Math.random() * faces.length)];
      if (face === lastFace) continue;
      if (oppositeFaces[face] === lastFace && face === secondLastFace) continue;

      const mod = modifiers[Math.floor(Math.random() * modifiers.length)];
      scramble.push(face + mod);
      secondLastFace = lastFace;
      lastFace = face;
    }

    return scramble.join(' ');
  }

  generateNewScramble() {
    this.currentScramble = SpeedTimer.generateScramble();
    if (this.scrambleEl) {
      this.scrambleEl.textContent = this.currentScramble;
    }

    // Render 2D Scramble Verification Preview
    if (this.scrambleNetEl) {
      const simCube = new Cube();
      simCube.applyAlgorithm(this.currentScramble);
      this.scrambleNetEl.innerHTML = DiagramGenerator.renderFlatNet(simCube, 220, 160);
    }

    return this.currentScramble;
  }

  loadSolves() {
    try {
      const data = localStorage.getItem('speedcube_solves');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  saveSolves() {
    try {
      localStorage.setItem('speedcube_solves', JSON.stringify(this.solves));
    } catch (e) {
      console.error('Failed to save solves', e);
    }
  }

  _bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const timerPane = document.getElementById('tab-timer');
      if (!timerPane || !timerPane.classList.contains('active')) return;

      if (e.code === 'Space') {
        e.preventDefault();
        this._handleDown();
      } else if (this.state === 'running') {
        this._stopTimer();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const timerPane = document.getElementById('tab-timer');
      if (!timerPane || !timerPane.classList.contains('active')) return;

      if (e.code === 'Space') {
        e.preventDefault();
        this._handleUp();
      }
    });

    // Touch controls on interactive surface
    const touchSurface = document.getElementById('timer-touch-surface');
    if (touchSurface) {
      touchSurface.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this._handleDown();
      }, { passive: false });

      touchSurface.addEventListener('touchend', (e) => {
        e.preventDefault();
        this._handleUp();
      }, { passive: false });

      touchSurface.addEventListener('mousedown', (e) => {
        if (e.button === 0) this._handleDown();
      });

      window.addEventListener('mouseup', (e) => {
        if (e.button === 0 && (this.state === 'holding' || this.state === 'ready')) {
          this._handleUp();
        }
      });
    }
  }

  _handleDown() {
    this._getAudioContext();

    if (this.state === 'running') {
      this._stopTimer();
      return;
    }

    if (this.state === 'idle') {
      this.state = 'holding';
      this._updateStatus('Hold down...', 'holding');

      this.holdTimeout = setTimeout(() => {
        if (this.state === 'holding') {
          this.state = 'ready';
          this.playReadySound();
          this._updateStatus('Ready! Release to start', 'ready');
        }
      }, 300);
    } else if (this.state === 'inspecting') {
      this.state = 'holding';
      this._updateStatus('Readying...', 'holding');
      this.holdTimeout = setTimeout(() => {
        if (this.state === 'holding') {
          this.state = 'ready';
          this.playReadySound();
          this._updateStatus('Ready! Release to start', 'ready');
        }
      }, 250);
    }
  }

  _handleUp() {
    if (this.state === 'holding') {
      clearTimeout(this.holdTimeout);
      this.state = 'idle';
      this._updateStatus('Hold until green!', 'idle');
    } else if (this.state === 'ready') {
      clearTimeout(this.holdTimeout);
      if (this.useInspection && this.state !== 'inspecting' && this.inspectionInterval === null) {
        this._startInspection();
      } else {
        this._startTimer();
      }
    }
  }

  _startInspection() {
    this.state = 'inspecting';
    this.inspectionSecondsLeft = 15;
    this._stopInspectionInterval();

    this._updateDisplay(`${this.inspectionSecondsLeft}`);
    this._updateStatus('INSPECTION (15s)', 'inspecting');

    this.inspectionInterval = setInterval(() => {
      this.inspectionSecondsLeft--;
      if (this.inspectionSecondsLeft <= 0) {
        this._stopInspectionInterval();
        this.playPenaltyWarningSound();
        this._updateDisplay('DNF');
        this.state = 'idle';
        this._updateStatus('Inspection exceeded (DNF)', 'idle');
      } else {
        this._updateDisplay(`${this.inspectionSecondsLeft}`);
        if (this.inspectionSecondsLeft === 7) {
          this.playWarningSound();
          this._updateStatus('8 SECONDS!', 'inspecting');
        } else if (this.inspectionSecondsLeft === 3) {
          this.playPenaltyWarningSound();
          this._updateStatus('12 SECONDS (+2 soon)!', 'inspecting');
        }
      }
    }, 1000);
  }

  _stopInspectionInterval() {
    if (this.inspectionInterval) {
      clearInterval(this.inspectionInterval);
      this.inspectionInterval = null;
    }
  }

  _startTimer() {
    this._stopInspectionInterval();
    this.state = 'running';
    this.startTime = performance.now();
    this._updateStatus('SOLVING...', 'running');

    this.timerInterval = setInterval(() => {
      const now = performance.now();
      this.elapsedTime = (now - this.startTime) / 1000;
      this._updateDisplay(SpeedTimer.formatTime(this.elapsedTime));
    }, 10);
  }

  _stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    const finalTime = this.elapsedTime;
    this.state = 'idle';
    this.playBeep(520, 0.05); // Solve stop click
    this._updateDisplay(SpeedTimer.formatTime(finalTime));
    this._updateStatus('Solved!', 'solved');

    this.solves.unshift({
      id: Date.now(),
      time: finalTime,
      scramble: this.currentScramble,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.saveSolves();
    this.generateNewScramble();
    this.updateStatsDisplay();
  }

  static formatTime(seconds) {
    if (typeof seconds !== 'number' || isNaN(seconds)) return '--';
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const remSecs = (seconds % 60).toFixed(2).padStart(5, '0');
      return `${mins}:${remSecs}`;
    }
    return seconds.toFixed(2);
  }

  static calculateAverage(timesList, count) {
    if (timesList.length < count) return null;
    const subset = timesList.slice(0, count).map(s => s.time);
    subset.sort((a, b) => a - b);
    const trimmed = subset.slice(1, -1);
    const sum = trimmed.reduce((acc, t) => acc + t, 0);
    return sum / trimmed.length;
  }

  updateStatsDisplay() {
    const timesOnly = this.solves.map(s => s.time);
    const best = timesOnly.length > 0 ? Math.min(...timesOnly) : null;
    const ao5 = SpeedTimer.calculateAverage(this.solves, 5);
    const ao12 = SpeedTimer.calculateAverage(this.solves, 12);

    if (this.bestEl) this.bestEl.textContent = best ? SpeedTimer.formatTime(best) : '--';
    if (this.ao5El) this.ao5El.textContent = ao5 ? SpeedTimer.formatTime(ao5) : '--';
    if (this.ao12El) this.ao12El.textContent = ao12 ? SpeedTimer.formatTime(ao12) : '--';

    this.renderHistory();
    this.renderProgressChart();
  }

  renderHistory() {
    if (!this.historyListEl) return;
    this.historyListEl.innerHTML = '';

    if (this.solves.length === 0) {
      this.historyListEl.innerHTML = '<div class="empty-history">No solves yet. Hold spacebar to begin!</div>';
      return;
    }

    this.solves.slice(0, 30).forEach((s, idx) => {
      const row = document.createElement('div');
      row.className = 'solve-item';
      row.innerHTML = `
        <span class="solve-index">#${this.solves.length - idx}</span>
        <span class="solve-time">${SpeedTimer.formatTime(s.time)}s</span>
        <span class="solve-date">${s.date}</span>
        <button class="solve-del-btn" title="Delete solve" data-id="${s.id}">&times;</button>
      `;

      row.querySelector('.solve-del-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteSolve(s.id);
      });

      this.historyListEl.appendChild(row);
    });
  }

  // --- Solve Progress Trendline Canvas Chart ---
  renderProgressChart() {
    if (!this.chartCanvas) return;
    const ctx = this.chartCanvas.getContext('2d');
    const w = this.chartCanvas.width;
    const h = this.chartCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    if (this.solves.length < 2) {
      ctx.fillStyle = '#64748b';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Complete 2+ solves to display progress trend', w / 2, h / 2);
      return;
    }

    const data = this.solves.slice(0, 25).reverse().map(s => s.time);
    const maxVal = Math.max(70, ...data);
    const minVal = 0;

    const padLeft = 36;
    const padBottom = 20;
    const plotW = w - padLeft - 10;
    const plotH = h - padBottom - 10;

    // Goal Lines: 60s, 30s, 20s (Golden), 10s
    const goalLines = [
      { sec: 60, label: '60s', color: '#94a3b8' },
      { sec: 30, label: '30s', color: '#f59e0b' },
      { sec: 20, label: '20s (Sub-20)', color: '#10b981' },
      { sec: 10, label: '10s (Sub-10)', color: '#38bdf8' }
    ];

    goalLines.forEach(g => {
      if (g.sec <= maxVal) {
        const y = 10 + plotH - (g.sec / maxVal) * plotH;
        ctx.strokeStyle = g.color;
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(w - 10, y);
        ctx.stroke();

        ctx.fillStyle = g.color;
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(g.label, padLeft - 4, y + 3);
      }
    });

    ctx.setLineDash([]);

    // Plot solve times line
    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;

    data.forEach((val, i) => {
      const x = padLeft + (i / (data.length - 1)) * plotW;
      const y = 10 + plotH - (val / maxVal) * plotH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Plot data points
    data.forEach((val, i) => {
      const x = padLeft + (i / (data.length - 1)) * plotW;
      const y = 10 + plotH - (val / maxVal) * plotH;

      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  deleteSolve(id) {
    this.solves = this.solves.filter(s => s.id !== id);
    this.saveSolves();
    this.updateStatsDisplay();
  }

  clearAllSolves() {
    if (confirm('Clear all session solve history?')) {
      this.solves = [];
      this.saveSolves();
      this.updateStatsDisplay();
    }
  }

  _updateDisplay(text) {
    if (this.displayEl) this.displayEl.textContent = text;
  }

  _updateStatus(text, statusClass) {
    if (this.statusEl) {
      this.statusEl.textContent = text;
      this.statusEl.className = `timer-status status-${statusClass}`;
    }
    if (this.displayEl) {
      this.displayEl.className = `timer-display state-${statusClass}`;
    }
  }
}
