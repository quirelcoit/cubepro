/**
 * CubeVisualizer - Professional 3D WebGL (Three.js) & 2D Canvas Last-Layer Visualizer
 * - Solid 3D cubies with tactile beveled plastic look (NO hollow/floating polygons)
 * - Buttery smooth 60fps layer rotation animations with cubic easing
 * - Full 3D orbital controls with damping & inertia
 * - Synchronized 2D top-down Last-Layer recognition view
 * - Complete keyboard controls (Space = Play/Pause, Left = Back, Right = Next, R = Reset)
 */

import { COLORS, Cube } from './cube-engine.js';
import { getMove } from './cube-moves.js';

export class CubeVisualizer {
  constructor(canvas3d, canvas2d, options = {}) {
    this.canvas3d = canvas3d;
    this.canvas2d = canvas2d;
    this.ctx2d = canvas2d ? canvas2d.getContext('2d') : null;

    this.cube = new Cube();
    this.initialState = this.cube.clone();

    // Playback state
    this.moves = [];
    this.currentStep = 0;
    this.isPlaying = false;
    this.playTimeout = null;
    this.animationVersion = 0;
    this.animationFrame = null;
    this.playbackSpeed = 1500; // ms per move (slower default for learning)

    // Animation state
    this.isAnimating = false;
    this.animDuration = 900; // ms for 90deg turn (slow enough to see)

    // Callbacks
    this.onStepChange = options.onStepChange || (() => {});
    this.onStateChange = options.onStateChange || (() => {});
    this.turnIndicatorId = options.turnIndicatorId || 'vis-rotating-face';

    this._initThree();
    this._setupKeyboardControls();
    this.render();

    // Mobile-first responsive canvas resizing
    window.addEventListener('resize', () => this.handleResize());
    if (window.ResizeObserver && this.canvas3d) {
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(this.canvas3d.parentElement);
    }
    setTimeout(() => this.handleResize(), 60);
  }

  handleResize() {
    if (!this.canvas3d || !this.renderer || !this.camera) return;
    const parent = this.canvas3d.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    if (!rect.width) return;
    const w = Math.floor(rect.width);
    const isMobile = window.innerWidth <= 768;
    const h = isMobile ? Math.min(280, Math.max(220, Math.floor(w * 0.7))) : 280;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.render();
  }

  _initThree() {
    if (!this.canvas3d || !window.THREE) {
      console.warn('Three.js not loaded or canvas missing');
      return;
    }

    const THREE = window.THREE;
    const width = this.canvas3d.width || 440;
    const height = this.canvas3d.height || 380;

    // Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(4.5, 4.2, 5.8);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas3d,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // OrbitControls
    if (window.THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.canvas3d);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.08;
      this.controls.minDistance = 4;
      this.controls.maxDistance = 12;
      this.controls.target.set(0, 0, 0);
    }

    // Lighting (Tactile speedcube plastic highlights)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.85);
    dirLight1.position.set(5, 10, 7);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.35);
    dirLight2.position.set(-5, -6, -5);
    this.scene.add(dirLight2);

    // Materials
    this.materials = {
      black: new THREE.MeshLambertMaterial({ color: 0x111622 }),
      U: new THREE.MeshLambertMaterial({ color: 0xffd500 }), // Yellow
      D: new THREE.MeshLambertMaterial({ color: 0xffffff }), // White
      F: new THREE.MeshLambertMaterial({ color: 0x009b48 }), // Green
      B: new THREE.MeshLambertMaterial({ color: 0x0046ad }), // Blue
      L: new THREE.MeshLambertMaterial({ color: 0xff5800 }), // Orange
      R: new THREE.MeshLambertMaterial({ color: 0xb71234 })  // Red
    };

    // Main Cube Group
    this.cubeGroup = new THREE.Group();
    this.scene.add(this.cubeGroup);

    // Pivot group for animated layer turns
    this.pivot = new THREE.Group();
    this.scene.add(this.pivot);

    // Build 26 solid cubies
    this.cubies = [];
    this.geometry = new THREE.BoxGeometry(0.96, 0.96, 0.96);
    this._sync3DFromCubeState();

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (document.hidden || !this.canvas3d.getClientRects().length) return;
      if (this.controls) this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  _setupKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      if (e.repeat || e.target.closest('input, textarea, select, button, [contenteditable], dialog[open]') || document.querySelector('dialog[open]')) return;

      const visPane = document.getElementById('tab-visualizer');
      if (!visPane || !visPane.classList.contains('active')) return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        this.pause();
        this.stepForward(true);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        this.stepBackward();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        this.reset();
      }
    });
  }

  notifyState() {
    this.onStateChange({ playing: this.isPlaying, animating: this.isAnimating, step: this.currentStep, total: this.moves.length });
  }

  cancelAnimation() {
    this.pause();
    this.animationVersion++;
    if (this.animationFrame !== null) cancelAnimationFrame(this.animationFrame);
    this.animationFrame = null;
    this.isAnimating = false;
    const indicator = document.getElementById(this.turnIndicatorId);
    if (indicator) indicator.style.opacity = '0';
  }

  setAlgorithm(algStr, setupStr = '', fromSolved = false) {
    const moves = Cube.parseAlgorithm(algStr);
    const initial = new Cube();
    initial.applyAlgorithm(setupStr || (fromSolved ? '' : Cube.invertAlgorithm(algStr)));
    this.cancelAnimation();
    this.initialState = initial;
    this.moves = moves;
    this.seek(0);
  }

  seek(step) {
    this.cancelAnimation();
    this.currentStep = Math.max(0, Math.min(this.moves.length, step));
    this.cube = this.initialState.clone();
    for (const move of this.moves.slice(0, this.currentStep)) this.cube.applyMove(move);
    this._sync3DFromCubeState();
    this.render2D();
    this.onStepChange(this.currentStep, this.moves, null);
    this.notifyState();
  }

  reset() { this.seek(0); }

  stepForward(animate = true, onDone = null) {
    if (this.isAnimating || this.currentStep >= this.moves.length) return false;
    const index = this.currentStep;
    const move = this.moves[index];
    const finish = () => {
      this.currentStep = index + 1;
      this.render2D();
      this.onStepChange(this.currentStep, this.moves, null);
      if (this.currentStep === this.moves.length) this.pause();
      else if (this.isPlaying) this.scheduleNext();
      this.notifyState();
      if (onDone) onDone();
    };
    this.onStepChange(index + 1, this.moves, index);
    if (animate && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      this.rotateLayer3D(move, finish);
    } else {
      this.cube.applyMove(move);
      this._sync3DFromCubeState();
      finish();
    }
    return true;
  }

  stepBackward() { this.seek(this.currentStep - 1); }

  scheduleNext() {
    clearTimeout(this.playTimeout);
    const version = this.animationVersion;
    this.playTimeout = setTimeout(() => {
      if (version === this.animationVersion && this.isPlaying) this.stepForward();
    }, Math.max(90, this.playbackSpeed - this.animDuration));
  }

  play() {
    if (this.isPlaying || !this.moves.length) return;
    if (this.currentStep >= this.moves.length) this.reset();
    this.isPlaying = true;
    this.notifyState();
    if (!this.isAnimating) this.stepForward();
  }

  pause() {
    this.isPlaying = false;
    clearTimeout(this.playTimeout);
    this.playTimeout = null;
    this.notifyState();
  }

  togglePlay() {
    if (this.isPlaying) this.pause(); else this.play();
    return this.isPlaying;
  }

  setSpeed(ms) {
    this.playbackSpeed = Math.max(300, Math.min(3000, Number(ms) || 1500));
    this.animDuration = Math.min(1400, this.playbackSpeed * 0.6);
  }

  restoreView() {
    if (!this.camera) return;
    this.camera.position.set(4.5, 4.2, 5.8);
    this.controls?.target.set(0, 0, 0);
    this.controls?.update();
  }

  rotateLayer3D(move, onComplete) {
    const { axis, layers, angle } = getMove(move);
    if (!this.pivot) {
      this.cube.applyMove(move);
      onComplete();
      return;
    }
    this.isAnimating = true;
    this.notifyState();
    const version = this.animationVersion;
    const indicator = document.getElementById(this.turnIndicatorId);
    if (indicator) { indicator.textContent = 'Turning ' + move; indicator.style.opacity = '1'; }
    this.pivot.rotation.set(0, 0, 0);
    for (const cubie of this.cubies) {
      if (layers.includes(Math.round(cubie.position[axis]))) this.pivot.add(cubie);
    }
    const startTime = performance.now(), duration = this.animDuration;
    const animateRotation = time => {
      if (version !== this.animationVersion) return;
      const progress = Math.max(0, Math.min(1, (time - startTime) / duration));
      this.pivot.rotation[axis] = angle * (0.5 - 0.5 * Math.cos(progress * Math.PI));
      if (progress < 1) this.animationFrame = requestAnimationFrame(animateRotation);
      else {
        this.animationFrame = null;
        this.isAnimating = false;
        this.cube.applyMove(move);
        this._sync3DFromCubeState();
        if (indicator) indicator.style.opacity = '0';
        onComplete();
      }
    };
    this.animationFrame = requestAnimationFrame(animateRotation);
  }

  executeMove(move, onComplete = null) {
    if (this.isAnimating) return false;
    this.cancelAnimation();
    this.rotateLayer3D(move, () => {
      this.render2D();
      if (onComplete) onComplete();
    });
    return true;
  }

  // Synchronize 3D cubies with the ACTUAL logical cube state (faces array)
  // Facelet index formulas verified mathematically against move implementations:
  //   U (y=1):   (z+1)*3 + (x+1)   — row from back(z=-1) to front(z=1), col left(x=-1) to right(x=1)
  //   D (y=-1):  (1-z)*3 + (x+1)   — row from front(z=1) to back(z=-1), col left(x=-1) to right(x=1)
  //   F (z=1):   (1-y)*3 + (x+1)   — row from top(y=1) to bottom(y=-1), col left(x=-1) to right(x=1)
  //   B (z=-1):  (1-y)*3 + (1-x)   — row from top(y=1) to bottom(y=-1), col right(x=1) to left(x=-1)
  //   R (x=1):   (1-y)*3 + (1-z)   — row from top(y=1) to bottom(y=-1), col front(z=1) to back(z=-1)
  //   L (x=-1):  (1-y)*3 + (z+1)   — row from top(y=1) to bottom(y=-1), col back(z=-1) to front(z=1)
  _sync3DFromCubeState() {
    const THREE = window.THREE;
    if (!THREE || !this.pivot) return;

    const faces = this.cube.faces;

    // Clear all cubies (including any in pivot)
    while (this.pivot.children.length > 0) {
      this.pivot.remove(this.pivot.children[0]);
    }
    while (this.cubeGroup.children.length > 0) {
      this.cubeGroup.remove(this.cubeGroup.children[0]);
    }
    this.pivot.rotation.set(0, 0, 0);
    this.cubies = [];

    const geom = this.geometry;
    const matFor = (colorKey) => this.materials[colorKey] || this.materials.black;

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          if (x === 0 && y === 0 && z === 0) continue;

          // BoxGeometry material index: [+X(R), -X(L), +Y(U), -Y(D), +Z(F), -Z(B)]
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
          cubie.userData = { initialPos: new THREE.Vector3(x, y, z) };

          this.cubeGroup.add(cubie);
          this.cubies.push(cubie);
        }
      }
    }
  }

  render() {
    this.render2D();
  }

  // --- 2D Top-Down View ---
  render2D() {
    if (!this.ctx2d || !this.canvas2d) return;
    const ctx = this.ctx2d;
    const w = this.canvas2d.width;
    const h = this.canvas2d.height;
    ctx.clearRect(0, 0, w, h);

    const size = Math.min(w, h) * 0.65;
    const stickerSize = size / 3;
    const startX = (w - size) / 2;
    const startY = (h - size) / 2;
    const rimThickness = stickerSize * 0.35;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    const faces = this.cube.faces;
    const legend = document.getElementById('vis-orientation');
    if (legend) legend.textContent = 'Top: ' + ({ U: 'yellow', D: 'white', F: 'green', B: 'blue', L: 'orange', R: 'red' }[faces.U[4]]) + ' · Front: ' + ({ U: 'yellow', D: 'white', F: 'green', B: 'blue', L: 'orange', R: 'red' }[faces.F[4]]);

    // Back rim
    for (let c = 0; c < 3; c++) {
      ctx.fillStyle = COLORS[faces.B[2 - c]];
      ctx.fillRect(startX + c * stickerSize + 2, startY - rimThickness - 3, stickerSize - 4, rimThickness);
    }
    // Front rim
    for (let c = 0; c < 3; c++) {
      ctx.fillStyle = COLORS[faces.F[c]];
      ctx.fillRect(startX + c * stickerSize + 2, startY + size + 3, stickerSize - 4, rimThickness);
    }
    // Left rim
    for (let r = 0; r < 3; r++) {
      ctx.fillStyle = COLORS[faces.L[r]];
      ctx.fillRect(startX - rimThickness - 3, startY + r * stickerSize + 2, rimThickness, stickerSize - 4);
    }
    // Right rim
    for (let r = 0; r < 3; r++) {
      ctx.fillStyle = COLORS[faces.R[2 - r]];
      ctx.fillRect(startX + size + 3, startY + r * stickerSize + 2, rimThickness, stickerSize - 4);
    }

    // Top face (U)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const idx = r * 3 + c;
        const facelet = faces.U[idx];
        const x = startX + c * stickerSize;
        const y = startY + r * stickerSize;

        ctx.fillStyle = COLORS[facelet] || '#ffd500';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 3;

        this._roundRect(ctx, x + 2, y + 2, stickerSize - 4, stickerSize - 4, 6);
        ctx.fill();
        ctx.stroke();
      }
    }
  }

  _roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}
