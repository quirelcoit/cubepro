/**
 * Trainer - Algorithm Flashcard Spaced-Repetition Trainer & F2L Metronome
 * Zero external dependencies.
 */

import { BEGINNER_LAST_LAYER, PLL_ALGORITHMS, F2L_CASES } from './algorithms-data.js';
import { DiagramGenerator } from './diagram-generator.js';
import { Cube } from './cube-engine.js';
import { STAGES, ALL_CASES, getLessonCases } from './curriculum.js';

export class AlgorithmTrainer {
  constructor(containerEl) {
    this.container = containerEl;
    this.currentCase = null;
    this.revealed = false;
    this.activeSet = 'pll'; // 'pll' | 'beginner' | 'f2l' | 'weak'
    this.scores = this.loadScores();

    // Stats
    this.sessionTested = 0;
    this.sessionCorrect = 0;

    // Metronome
    this.metronomeInterval = null;
    this.metronomeBpm = 60;
    this.isMetronomeRunning = false;
    this.audioCtx = null;

    this.init();
  }

  loadScores() {
    try {
      const data = localStorage.getItem('speedcube_drill_scores');
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  saveScores() {
    try {
      localStorage.setItem('speedcube_drill_scores', JSON.stringify(this.scores));
    } catch (e) {
      console.warn('Failed to save drill scores', e);
    }
  }

  _getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playMetronomeClick() {
    try {
      const ctx = this._getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      console.warn('Metronome audio error', e);
    }
  }

  init() {
    if (!this.container) return;
    this.render();
    this.nextCard();
  }

  setLesson(stage, level) {
    this.lessonCases = getLessonCases(stage, level);
    this.lessonLabel = STAGES[stage].name + ' · ' + level;
    this.activeSet = '';
    this.render(); this.nextCard(); this.updateStats(); this.updateMetronomeControls();
  }

  getPool() {
    if (this.lessonCases) return this.lessonCases;
    let pool = [];
    if (this.activeSet === 'pll') {
      pool = PLL_ALGORITHMS;
    } else if (this.activeSet === 'cross') {
      pool = ALL_CASES.filter(c => c.id.startsWith('cross-'));
    } else if (this.activeSet === 'oll') {
      pool = getLessonCases('oll', 'beginner');
    } else if (this.activeSet === '2lookpll') {
      pool = getLessonCases('pll', 'beginner');
    } else if (this.activeSet === 'beginner') {
      BEGINNER_LAST_LAYER.forEach(group => {
        group.cases.forEach(c => pool.push(c));
      });
    } else if (this.activeSet === 'f2l') {
      pool = F2L_CASES;
    } else if (this.activeSet === 'weak') {
      // Find cases where score < 2
      const all = ALL_CASES;
      pool = all.filter(item => (this.scores[item.id] || 0) < 2);
      if (pool.length === 0) pool = PLL_ALGORITHMS;
    }
    return pool;
  }

  nextCard() {
    const pool = this.getPool();
    if (pool.length === 0) return;

    // Weight selection towards weaker scored items
    const weighted = [];
    pool.forEach(item => {
      const score = this.scores[item.id] || 0;
      // Lower score = higher appearance weight
      const weight = Math.max(1, 4 - score);
      for (let i = 0; i < weight; i++) {
        weighted.push(item);
      }
    });

    const chosen = weighted[Math.floor(Math.random() * weighted.length)];
    this.currentCase = chosen;
    this.revealed = false;
    this.renderCard();
  }

  grade(rating) {
    if (!this.currentCase) return;
    this.sessionTested++;
    const id = this.currentCase.id;
    let currentScore = this.scores[id] || 0;

    if (rating === 'easy') {
      currentScore = Math.min(3, currentScore + 1);
      this.sessionCorrect++;
    } else if (rating === 'good') {
      currentScore = Math.max(1, currentScore);
      this.sessionCorrect++;
    } else if (rating === 'hard') {
      currentScore = Math.max(0, currentScore - 1);
    }

    this.scores[id] = currentScore;
    this.saveScores();
    this.updateStats();
    this.nextCard();
  }

  toggleMetronome() {
    if (this.isMetronomeRunning) {
      clearInterval(this.metronomeInterval);
      this.metronomeInterval = null;
      this.isMetronomeRunning = false;
    } else {
      this._getAudioContext();
      this.isMetronomeRunning = true;
      const ms = (60 / this.metronomeBpm) * 1000;
      this.metronomeInterval = setInterval(() => {
        this.playMetronomeClick();
        const pulse = document.getElementById('metro-pulse-dot');
        if (pulse) {
          pulse.classList.add('pulsing');
          setTimeout(() => pulse.classList.remove('pulsing'), 100);
        }
      }, ms);
    }
    this.updateMetronomeControls();
  }

  setMetronomeBpm(bpm) {
    this.metronomeBpm = bpm;
    if (this.isMetronomeRunning) {
      clearInterval(this.metronomeInterval);
      const ms = (60 / this.metronomeBpm) * 1000;
      this.metronomeInterval = setInterval(() => {
        this.playMetronomeClick();
        const pulse = document.getElementById('metro-pulse-dot');
        if (pulse) {
          pulse.classList.add('pulsing');
          setTimeout(() => pulse.classList.remove('pulsing'), 100);
        }
      }, ms);
    }
  }

  render() {
    this.container.innerHTML = `
      <div class="trainer-layout">
        <!-- Flashcard Column -->
        <div class="flashcard-panel glass-panel">
          <div class="trainer-header">
            <div>
              <h3>Recognition &amp; recall</h3><p class="drill-lesson-label">${this.lessonLabel || "Choose a practice set"}</p>
              <p class="text-sm text-muted">Active recall training to eliminate hesitation during real solves.</p>
            </div>
            <div class="trainer-set-selector">
              <button class="set-pill ${this.activeSet === 'pll' ? 'active' : ''}" data-set="pll">Full PLL</button>
              <button class="set-pill" data-set="cross">Cross</button><button class="set-pill" data-set="oll">2-Look OLL</button><button class="set-pill" data-set="2lookpll">2-Look PLL</button>
              <button class="set-pill ${this.activeSet === 'f2l' ? 'active' : ''}" data-set="f2l">F2L</button>
              <button class="set-pill ${this.activeSet === 'weak' ? 'active' : ''}" data-set="weak">Weak Cases</button>
            </div>
          </div>

          <!-- Active Card Stage -->
          <div id="flashcard-stage" class="flashcard-stage">
            <!-- Rendered by renderCard() -->
          </div>

          <!-- Session Progress Bar -->
          <div class="drill-session-stats">
            <span id="drill-stats-text">Session Tested: 0 &bull; Accuracy: 0%</span>
          </div>
        </div>

        <!-- Lookahead Metronome Column -->
        <div class="metronome-panel glass-panel">
          <div class="metro-header">
            <h4>F2L Lookahead Metronome</h4>
            <div id="metro-pulse-dot" class="metro-pulse-dot"></div>
          </div>
          <p class="text-sm text-muted">
            The #1 secret to Sub-20s: <strong>Turn smoothly at 1-2 moves per second without pausing to search!</strong>
          </p>

          <div class="metro-controls">
            <div class="bpm-display">
              <span id="metro-bpm-val">${this.metronomeBpm}</span>
              <span class="bpm-unit">BPM (Turns/Min)</span>
            </div>

            <input type="range" id="metro-slider" min="30" max="140" step="5" value="${this.metronomeBpm}">

            <button id="metro-btn-toggle" class="btn btn-primary" style="width: 100%; margin-top: 14px;">
              &#9658; Start Metronome
            </button>
          </div>

          <div class="metro-guide">
            <span class="guide-tag">DRILL PROTOCOL</span>
            <ul>
              <li><strong>60 BPM:</strong> Beginners (1 turn every second). Never stop turning!</li>
              <li><strong>90 BPM:</strong> Intermediate (Sub-25 milestone).</li>
              <li><strong>120 BPM:</strong> Advanced (Sub-20 milestone: 2 turns/sec).</li>
            </ul>
          </div>
        </div>
      </div>
    `;

    // Bind Set Selectors
    this.container.querySelectorAll('.set-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.container.querySelectorAll('.set-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeSet = btn.dataset.set; this.lessonCases = null; this.lessonLabel = '';
        this.container.querySelector('.drill-lesson-label').textContent = btn.textContent;
        this.nextCard();
      });
    });

    // Bind Metronome Slider & Button
    const metroSlider = document.getElementById('metro-slider');
    const bpmVal = document.getElementById('metro-bpm-val');
    const metroToggle = document.getElementById('metro-btn-toggle');

    if (metroSlider) {
      metroSlider.addEventListener('input', (e) => {
        const bpm = parseInt(e.target.value);
        if (bpmVal) bpmVal.textContent = bpm;
        this.setMetronomeBpm(bpm);
      });
    }

    if (metroToggle) {
      metroToggle.addEventListener('click', () => this.toggleMetronome());
    }
  }

  updateMetronomeControls() {
    const btn = document.getElementById('metro-btn-toggle');
    if (btn) {
      btn.innerHTML = this.isMetronomeRunning ? '&#10074;&#10074; Stop Metronome' : '&#9658; Start Metronome';
      btn.className = this.isMetronomeRunning ? 'btn btn-secondary text-danger' : 'btn btn-primary';
    }
  }

  renderCard() {
    const stage = document.getElementById('flashcard-stage');
    if (!stage || !this.currentCase) return;

    const item = this.currentCase;
    let diagramHtml = '';

    const preview = new Cube();
    preview.applyAlgorithm(item.setup || Cube.invertAlgorithm(item.recommendedAlg || item.alg));
    diagramHtml = DiagramGenerator.renderFlatNet(preview, 240, 180);

    const algCode = item.recommendedAlg || item.alg;

    stage.innerHTML = `
      <div class="card-diagram-box">
        ${diagramHtml}
        <div class="card-case-badge">${item.category || item.group || item.type || 'Case'}</div>
      </div>

      <div class="card-content-box">
        <h3 class="card-case-name">${item.name}</h3>
        ${item.recognition ? `<p class="card-recognition"><strong>Recognition:</strong> ${item.recognition}</p>` : ''}

        ${!this.revealed ? `
          <div class="reveal-prompt-box">
            <p class="text-muted">Do you remember the algorithm?</p>
            <button id="btn-reveal-alg" class="btn btn-primary">Reveal Formula &rarr;</button>
          </div>
        ` : `
          <div class="revealed-alg-box">
            <span class="formula-label">Algorithm:</span>
            <div class="formula-code">${algCode}</div>
            ${item.qiyiAlg ? `<div class="formula-qiyi">QiYi: ${item.qiyiAlg}</div>` : ''}

            <div class="drill-rating-buttons">
              <button class="btn-grade grade-hard" data-grade="hard">&#10006; Hard (Failed)</button>
              <button class="btn-grade grade-good" data-grade="good">&#9679; Good (Slow)</button>
              <button class="btn-grade grade-easy" data-grade="easy">&#10003; Easy (Mastered)</button>
            </div>
          </div>
        `}
      </div>
    `;

    // Bind reveal button
    const revealBtn = stage.querySelector('#btn-reveal-alg');
    if (revealBtn) {
      revealBtn.addEventListener('click', () => {
        this.revealed = true;
        this.renderCard();
      });
    }

    // Bind grade buttons
    stage.querySelectorAll('.btn-grade').forEach(btn => {
      btn.addEventListener('click', () => {
        const grade = btn.dataset.grade;
        this.grade(grade);
      });
    });
  }

  updateStats() {
    const text = document.getElementById('drill-stats-text');
    if (text) {
      const pct = this.sessionTested > 0 ? Math.round((this.sessionCorrect / this.sessionTested) * 100) : 0;
      text.textContent = `Session Tested: ${this.sessionTested} \u2022 Recall Rate: ${pct}%`;
    }
  }
}
