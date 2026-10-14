/**
 * PlayCube - Interactive 3D Virtual Rubik's Cube Simulator
 * Allows users to play and solve a 3D Rubik's Cube on mobile and desktop without physical hardware.
 * Features:
 * - Ultra-responsive 60fps WebGL rendering (Three.js) with OrbitControls
 * - Turn queueing for fluid, zero-lockup finger taps
 * - WCA random scramble generator
 * - Auto-start solve stopwatch & move counter
 * - Automatic solved-state victory celebration
 * - Haptic feedback & tactile audio clicks
 * - Desktop keyboard controls
 */

import { COLORS, Cube } from './cube-engine.js';
import { getMove } from './cube-moves.js';

export class PlayCube {
  constructor(canvasEl, options = {}) {
    this.canvas = canvasEl;
    this.cube = new Cube();
    this.moveHistory = [];
    this.moveQueue = [];
    this.isAnimating = false;
    this.animDuration = 140; // Fast and snappy for gameplay (ms)
    this.animationVersion = 0;
    this.animationFrame = null;

    // Game state
    this.isScrambled = false;
    this.moveCount = 0;
    this.timerRunning = false;
    this.timerStartTime = 0;
    this.timerInterval = null;
    this.elapsedMs = 0;
    this.audioEnabled = true;
    this.audioCtx = null;

    // Callbacks
    this.onStateChange = options.onStateChange || (() => {});

    this._initThree();
    this._setupKeyboard();
    this._bindTouchControls();

    // Responsive sizing
    window.addEventListener('resize', () => this.handleResize());
    if (window.ResizeObserver && this.canvas) {
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.canvas.parentElement);
    }
    setTimeout(() => this.handleResize(), 60);
  }

  handleResize() {
    if (!this.canvas || !this.renderer || !this.camera) return;
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    if (!rect.width) return;
    const w = Math.floor(rect.width);
    const isMobile = window.innerWidth <= 768;
    const h = isMobile ? Math.min(340, Math.max(260, Math.floor(w * 0.85))) : 360;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  _initThree() {
    if (!this.canvas || !window.THREE) return;
    const THREE = window.THREE;
    const width = this.canvas.width || 460;
    const height = this.canvas.height || 340;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(4.6, 4.2, 5.8);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (window.THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.canvas);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.08;
      this.controls.minDistance = 4;
      this.controls.maxDistance = 12;
      this.controls.target.set(0, 0, 0);
    }

    // Lighting for realistic plastic finish
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.82);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight1.position.set(5, 10, 7);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight2.position.set(-5, -6, -5);
    this.scene.add(dirLight2);

    this.materials = {
      black: new THREE.MeshLambertMaterial({ color: 0x111622 }),
      U: new THREE.MeshLambertMaterial({ color: 0xffd500 }), // Yellow
      D: new THREE.MeshLambertMaterial({ color: 0xffffff }), // White
      F: new THREE.MeshLambertMaterial({ color: 0x009b48 }), // Green
      B: new THREE.MeshLambertMaterial({ color: 0x0046ad }), // Blue
      L: new THREE.MeshLambertMaterial({ color: 0xff5800 }), // Orange
      R: new THREE.MeshLambertMaterial({ color: 0xb71234 })  // Red
    };

    this.cubeGroup = new THREE.Group();
    this.scene.add(this.cubeGroup);

    this.pivot = new THREE.Group();
    this.scene.add(this.pivot);

    this.cubies = [];
    this.geometry = new THREE.BoxGeometry(0.96, 0.96, 0.96);
    this._sync3D();

    const animate = () => {
      requestAnimationFrame(animate);
      if (document.hidden || !this.canvas.getClientRects().length) return;
      if (this.controls) this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  _sync3D() {
    const THREE = window.THREE;
    if (!THREE || !this.pivot) return;

    const faces = this.cube.faces;
    while (this.pivot.children.length > 0) this.pivot.remove(this.pivot.children[0]);
    while (this.cubeGroup.children.length > 0) this.cubeGroup.remove(this.cubeGroup.children[0]);
    this.pivot.rotation.set(0, 0, 0);
    this.cubies = [];

    const geom = this.geometry;
    const matFor = (key) => this.materials[key] || this.materials.black;

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue;

          const matArray = [
            x === 1  ? matFor(faces.R[(1 - y) * 3 + (1 - z)]) : this.materials.black,
            x === -1 ? matFor(faces.L[(1 - y) * 3 + (z + 1)]) : this.materials.black,
            y === 1  ? matFor(faces.U[(z + 1) * 3 + (x + 1)]) : this.materials.black,
            y === -1 ? matFor(faces.D[(1 - z) * 3 + (x + 1)]) : this.materials.black,
            z === 1  ? matFor(faces.F[(1 - y) * 3 + (x + 1)]) : this.materials.black,
            z === -1 ? matFor(faces.B[(1 - y) * 3 + (1 - x)]) : this.materials.black
          ];

          const cubie = new THREE.Mesh(geom, matArray);
          cubie.position.set(x, y, z);
          this.cubeGroup.add(cubie);
          this.cubies.push(cubie);
        }
      }
    }
  }

  executeMove(move, trackHistory = true) {
    if (!move) return;

    // Handle compound triggers (e.g. "R U R' U'")
    if (move.includes(' ')) {
      const parts = move.trim().split(/\s+/);
      for (const p of parts) this.executeMove(p, trackHistory);
      return;
    }

    if (this.isAnimating) {
      this.moveQueue.push({ move, trackHistory });
      return;
    }

    this._performMove(move, trackHistory);
  }

  _performMove(move, trackHistory) {
    const { axis, layers, angle } = getMove(move);

    // Start timer on first move if scrambled and not running
    if (this.isScrambled && !this.timerRunning && trackHistory) {
      this.startTimer();
    }

    if (trackHistory) {
      this.moveHistory.push(move);
      this.moveCount++;
      this._updateStatsUI();
    }

    this._playClickSound();
    if (navigator.vibrate) navigator.vibrate(8);

    const indicator = document.getElementById('play-turn-hud');
    if (indicator) {
      indicator.textContent = move;
      indicator.style.opacity = '1';
    }

    this.isAnimating = true;
    this.pivot.rotation.set(0, 0, 0);

    for (const cubie of this.cubies) {
      if (layers.includes(Math.round(cubie.position[axis]))) {
        this.pivot.add(cubie);
      }
    }

    const startTime = performance.now();
    const duration = this.animDuration;

    const step = (now) => {
      const progress = Math.max(0, Math.min(1, (now - startTime) / duration));
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      this.pivot.rotation[axis] = angle * ease;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.cube.applyMove(move);
        this._sync3D();
        this.isAnimating = false;

        if (indicator) {
          setTimeout(() => {
            if (!this.isAnimating) indicator.style.opacity = '0';
          }, 180);
        }

        // Check if solved!
        this._checkSolved();

        // Process queue
        if (this.moveQueue.length > 0) {
          const next = this.moveQueue.shift();
          this._performMove(next.move, next.trackHistory);
        }
      }
    };

    requestAnimationFrame(step);
  }

  _checkSolved() {
    if (this.isScrambled && this.cube.isSolved()) {
      this.isScrambled = false;
      this.stopTimer();
      this._triggerVictory();
    }
  }

  _triggerVictory() {
    const victoryModal = document.getElementById('play-victory-banner');
    if (victoryModal) {
      const timeStr = this._formatTime(this.elapsedMs);
      const tps = this.elapsedMs > 0 ? (this.moveCount / (this.elapsedMs / 1000)).toFixed(1) : '0.0';
      document.getElementById('play-vic-time').textContent = timeStr;
      document.getElementById('play-vic-moves').textContent = this.moveCount;
      document.getElementById('play-vic-tps').textContent = `${tps} TPS`;
      victoryModal.classList.add('visible');
    }
  }

  startTimer() {
    if (this.timerRunning) return;
    this.timerRunning = true;
    this.timerStartTime = performance.now() - this.elapsedMs;
    this.timerInterval = setInterval(() => {
      this.elapsedMs = performance.now() - this.timerStartTime;
      const el = document.getElementById('play-timer-digits');
      if (el) el.textContent = this._formatTime(this.elapsedMs);
    }, 20);
  }

  stopTimer() {
    this.timerRunning = false;
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  }

  resetTimer() {
    this.stopTimer();
    this.elapsedMs = 0;
    const el = document.getElementById('play-timer-digits');
    if (el) el.textContent = '00:00.00';
  }

  _formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centis = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
  }

  scramble() {
    this.resetTimer();
    this.moveHistory = [];
    this.moveCount = 0;
    this.isScrambled = true;
    this._hideVictory();

    // Generate random WCA scramble
    const faces = ['U', 'D', 'F', 'B', 'L', 'R'];
    const modifiers = ['', "'", '2'];
    const scrambleMoves = [];
    let lastFace = '', secondLastFace = '';

    while (scrambleMoves.length < 21) {
      const face = faces[Math.floor(Math.random() * faces.length)];
      if (face === lastFace) continue;
      // Prevent opposing face cancellation (e.g. U D U)
      const opposite = { U: 'D', D: 'U', F: 'B', B: 'F', L: 'R', R: 'L' };
      if (face === secondLastFace && lastFace === opposite[face]) continue;

      const mod = modifiers[Math.floor(Math.random() * modifiers.length)];
      scrambleMoves.push(face + mod);
      secondLastFace = lastFace;
      lastFace = face;
    }

    const scrambleStr = scrambleMoves.join(' ');
    const scrambleEl = document.getElementById('play-scramble-display');
    if (scrambleEl) scrambleEl.textContent = scrambleStr;

    // Apply scramble instantly
    this.cube.reset();
    for (const m of scrambleMoves) {
      this.cube.applyMove(m);
    }
    this._sync3D();
    this._updateStatsUI();
  }

  undo() {
    if (this.moveHistory.length === 0 || this.isAnimating) return;
    const last = this.moveHistory.pop();
    this.moveCount = Math.max(0, this.moveCount - 1);
    const inverse = last.endsWith('2') ? last : last.endsWith("'") ? last.slice(0, -1) : last + "'";
    this.executeMove(inverse, false);
    this._updateStatsUI();
  }

  resetCube() {
    this.cube.reset();
    this.moveHistory = [];
    this.moveCount = 0;
    this.moveQueue = [];
    this.isScrambled = false;
    this.resetTimer();
    this._sync3D();
    this._hideVictory();
    this._updateStatsUI();

    const scrambleEl = document.getElementById('play-scramble-display');
    if (scrambleEl) scrambleEl.textContent = 'Cube is in solved state. Tap Scramble to start playing!';
  }

  restoreView() {
    if (!this.camera || !this.controls) return;
    this.camera.position.set(4.6, 4.2, 5.8);
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  _hideVictory() {
    const modal = document.getElementById('play-victory-banner');
    if (modal) modal.classList.remove('visible');
  }

  _updateStatsUI() {
    const movesEl = document.getElementById('play-moves-count');
    if (movesEl) movesEl.textContent = `${this.moveCount} moves`;
  }

  _playClickSound() {
    if (!this.audioEnabled) return;
    try {
      if (!this.audioCtx) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) this.audioCtx = new AudioClass();
      }
      if (this.audioCtx) {
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320 + Math.random() * 60, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, this.audioCtx.currentTime + 0.035);
        gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.045);
      }
    } catch {}
  }

  _setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      const playPane = document.getElementById('tab-play');
      if (!playPane || !playPane.classList.contains('active')) return;
      if (e.repeat || e.target.closest('input, textarea, select, [contenteditable], dialog[open]')) return;

      const key = e.key;
      const isShift = e.shiftKey;

      const keymap = {
        'j': 'U', 'f': "U'",
        'i': 'R', 'k': "R'",
        'h': 'F', 'g': "F'",
        'd': 'L', 'e': "L'",
        's': 'D', 'l': "D'",
        'w': 'B', 'o': "B'",
        'b': 'M', 'n': "M'"
      };

      if (keymap[key.toLowerCase()]) {
        e.preventDefault();
        this.executeMove(keymap[key.toLowerCase()]);
        return;
      }

      const direct = key.toUpperCase();
      if (['U', 'R', 'F', 'L', 'D', 'B', 'M'].includes(direct)) {
        e.preventDefault();
        this.executeMove(direct + (isShift ? "'" : ''));
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (!this.isScrambled) this.scramble();
        else if (this.timerRunning) this.stopTimer();
        else this.startTimer();
      }
    });
  }

  _bindTouchControls() {
    // Touch buttons bound in app.js or directly in DOM
  }
}
