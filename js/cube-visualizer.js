/**
 * CubeVisualizer - Professional 3D WebGL (Three.js) & 2D Canvas Last-Layer Visualizer
 * - Solid 3D cubies with tactile beveled plastic look (NO hollow/floating polygons)
 * - Buttery smooth 60fps layer rotation animations with cubic easing
 * - Full 3D orbital controls with damping & inertia
 * - Synchronized 2D top-down Last-Layer recognition view
 * - Complete keyboard controls (Space = Play/Pause, Left = Back, Right = Next, R = Reset)
 */

import { COLORS, Cube } from './cube-engine.js';

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
    this.playInterval = null;
    this.playbackSpeed = 1500; // ms per move (slower default for learning)

    // Animation state
    this.isAnimating = false;
    this.animDuration = 600; // ms for 90deg turn (slow enough to see)

    // Callbacks
    this.onStepChange = options.onStepChange || (() => {});

    this._initThree();
    this._setupKeyboardControls();
    this.render();

    // Mobile-first responsive canvas resizing
    window.addEventListener('resize', () => this.handleResize());
    setTimeout(() => this.handleResize(), 60);
  }

  handleResize() {
    if (!this.canvas3d || !this.renderer || !this.camera) return;
    const parent = this.canvas3d.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const w = Math.floor(rect.width) || 360;
    const isMobile = window.innerWidth <= 768;
    const h = isMobile ? Math.min(340, Math.max(260, Math.floor(w * 0.82))) : 380;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
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

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.35);
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
    this._buildSolidCubies();

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (this.controls) this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    animate();
  }

  _buildSolidCubies() {
    const THREE = window.THREE;
    const size = 0.96; // Slight dark seam between cubies
    const geom = new THREE.BoxGeometry(size, size, size);

    // Clear existing
    while (this.cubeGroup.children.length > 0) {
      this.cubeGroup.remove(this.cubeGroup.children[0]);
    }
    this.cubies = [];

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Skip internal hidden core
          if (x === 0 && y === 0 && z === 0) continue;

          // Multi-material box: [Right, Left, Top, Bottom, Front, Back]
          // In standard speedcubing orientation:
          // Top (+Y) = Yellow, Bottom (-Y) = White
          // Front (+Z) = Green, Back (-Z) = Blue
          // Left (-X) = Orange, Right (+X) = Red
          const matArray = [
            x === 1 ? this.materials.R : this.materials.black, // +X
            x === -1 ? this.materials.L : this.materials.black, // -X
            y === 1 ? this.materials.U : this.materials.black, // +Y
            y === -1 ? this.materials.D : this.materials.black, // -Y
            z === 1 ? this.materials.F : this.materials.black, // +Z
            z === -1 ? this.materials.B : this.materials.black  // -Z
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

  _setupKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const visPane = document.getElementById('tab-visualizer');
      if (!visPane || !visPane.classList.contains('active')) return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
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

  setAlgorithm(algStr, setupStr = '') {
    this.pause();
    this.cube.reset();

    if (setupStr) {
      this.cube.applyAlgorithm(setupStr);
    } else if (algStr) {
      const inverse = Cube.invertAlgorithm(algStr);
      this.cube.applyAlgorithm(inverse);
    }

    this.initialState = this.cube.clone();
    this.moves = Cube.parseAlgorithm(algStr);
    this.currentStep = 0;

    // Reset 3D physical cubies to match logical cube state
    this._sync3DFromCubeState();
    this.render2D();
    this.onStepChange(this.currentStep, this.moves, null);
  }

  reset() {
    this.pause();
    this.cube = this.initialState.clone();
    this.currentStep = 0;
    this._sync3DFromCubeState();
    this.render2D();
    this.onStepChange(this.currentStep, this.moves, null);
  }

  stepForward(animate = true, onDone = null) {
    if (this.isAnimating) return false;
    if (this.currentStep < this.moves.length) {
      const moveIndex = this.currentStep;
      const move = this.moves[moveIndex];

      if (animate && this.playbackSpeed >= 180) {
        // SIMULTANEOUS ACTIVATION: Notify ribbon pill to move & highlight AT THE EXACT SAME INSTANT rotation begins!
        this.onStepChange(moveIndex + 1, this.moves, moveIndex);

        this.rotateLayer3D(move, () => {
          this.currentStep++;
          this.render2D();
          this.onStepChange(this.currentStep, this.moves, null);
          if (onDone) onDone();
        });
      } else {
        this.onStepChange(moveIndex + 1, this.moves, moveIndex);
        this.cube.applyMove(move);
        this.currentStep++;
        this._sync3DFromCubeState();
        this.render2D();
        this.onStepChange(this.currentStep, this.moves, null);
        if (onDone) onDone();
      }
      return true;
    }
    return false;
  }

  stepBackward() {
    if (this.isAnimating) return false;
    if (this.currentStep > 0) {
      this.pause();
      this.cube = this.initialState.clone();
      this.currentStep--;
      for (let i = 0; i < this.currentStep; i++) {
        this.cube.applyMove(this.moves[i]);
      }
      this._sync3DFromCubeState();
      this.render2D();
      this.onStepChange(this.currentStep, this.moves, this.currentStep > 0 ? this.currentStep - 1 : null);
      return true;
    }
    return false;
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    if (this.currentStep >= this.moves.length) {
      this.reset();
    }

    const runNext = () => {
      if (!this.isPlaying) return;
      if (this.currentStep >= this.moves.length) {
        this.pause();
        return;
      }
      const ok = this.stepForward(true, () => {
        if (!this.isPlaying) return;
        if (this.currentStep < this.moves.length) {
          const pauseGap = Math.max(90, this.playbackSpeed - this.animDuration);
          this.playTimeout = setTimeout(runNext, pauseGap);
        } else {
          this.pause();
        }
      });
      if (!ok && this.currentStep >= this.moves.length) {
        this.pause();
      }
    };

    // Run first step immediately without waiting full interval
    runNext();
  }

  pause() {
    this.isPlaying = false;
    if (this.playTimeout) {
      clearTimeout(this.playTimeout);
      this.playTimeout = null;
    }
    if (this.playInterval) {
      clearInterval(this.playInterval);
      this.playInterval = null;
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  setSpeed(ms) {
    this.playbackSpeed = ms;
    // Deliberate, clear rotation speed: 50% to 65% of interval
    this.animDuration = Math.min(1400, Math.max(250, ms * 0.6));
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
  }

  // Interactively execute and visualize a single move or trigger sequence
  visualizeSingleMove(moveInput) {
    if (this.isAnimating) return;
    this.pause();
    const moves = Cube.parseAlgorithm(moveInput);
    if (moves.length === 0) return;

    if (moves.length === 1) {
      this.rotateLayer3D(moves[0], () => {
        this.render2D();
      });
    } else {
      let idx = 0;
      const playNext = () => {
        if (idx < moves.length) {
          const m = moves[idx++];
          this.rotateLayer3D(m, () => {
            this.render2D();
            if (idx < moves.length) {
              setTimeout(playNext, 120);
            }
          });
        }
      };
      playNext();
    }
  }

  // --- Smooth 3D Layer Rotation in WebGL ---
  rotateLayer3D(move, onComplete) {
    const THREE = window.THREE;
    if (!THREE) {
      onComplete();
      return;
    }

    this.isAnimating = true;
    const clean = move.trim();

    const is2 = clean.includes('2');
    const isPrime = clean.includes("'") || clean.includes("’") || clean.includes("`");
    const baseAngle = is2 ? Math.PI : Math.PI / 2;

    let axis = 'y';
    let filterFn = (pos) => true;
    let angle = -Math.PI / 2;
    let moveDesc = '';

    // Handle standard, wide, and slice moves
    if (clean.startsWith('U') && !clean.startsWith('Uw')) {
      axis = 'y'; filterFn = (pos) => pos.y > 0.5;
      angle = isPrime ? baseAngle : -baseAngle;
      moveDesc = isPrime ? "U' ➜ Top Face Counter-Clockwise (Flick Right ➡️)" : (is2 ? "U2 ➜ Top Face Double Turn 180°" : "U ➜ Top Face Clockwise (Flick Left ⬅️)");
    } else if (clean.startsWith('u') || clean.startsWith('Uw')) {
      axis = 'y'; filterFn = (pos) => pos.y > -0.5; // Top 2 layers
      angle = isPrime ? baseAngle : -baseAngle;
      moveDesc = isPrime ? "u' ➜ Top TWO Layers Counter-Clockwise" : (is2 ? "u2 ➜ Top TWO Layers 180°" : "u ➜ Top TWO Layers Clockwise");
    } else if (clean.startsWith('D') && !clean.startsWith('Dw')) {
      axis = 'y'; filterFn = (pos) => pos.y < -0.5;
      angle = isPrime ? -baseAngle : baseAngle;
      moveDesc = isPrime ? "D' ➜ Bottom Face Counter-Clockwise" : (is2 ? "D2 ➜ Bottom Face 180°" : "D ➜ Bottom Face Clockwise");
    } else if (clean.startsWith('d') || clean.startsWith('Dw')) {
      axis = 'y'; filterFn = (pos) => pos.y < 0.5; // Bottom 2 layers
      angle = isPrime ? -baseAngle : baseAngle;
      moveDesc = isPrime ? "d' ➜ Bottom TWO Layers Counter-Clockwise" : (is2 ? "d2 ➜ Bottom TWO Layers 180°" : "d ➜ Bottom TWO Layers Clockwise");
    } else if (clean.startsWith('R') && !clean.startsWith('Rw')) {
      axis = 'x'; filterFn = (pos) => pos.x > 0.5;
      angle = isPrime ? baseAngle : -baseAngle;
      moveDesc = isPrime ? "R' ➜ Right Face Downwards ⬇️" : (is2 ? "R2 ➜ Right Face 180°" : "R ➜ Right Face Upwards ⬆️");
    } else if (clean.startsWith('r') || clean.startsWith('Rw')) {
      axis = 'x'; filterFn = (pos) => pos.x > -0.5; // Right 2 layers
      angle = isPrime ? baseAngle : -baseAngle;
      moveDesc = isPrime ? "r' ➜ Right TWO Layers Downwards ⬇️" : (is2 ? "r2 ➜ Right TWO Layers 180°" : "r ➜ Right TWO Layers Upwards ⬆️");
    } else if (clean.startsWith('L') && !clean.startsWith('Lw')) {
      axis = 'x'; filterFn = (pos) => pos.x < -0.5;
      angle = isPrime ? -baseAngle : baseAngle;
      moveDesc = isPrime ? "L' ➜ Left Face Upwards ⬆️" : (is2 ? "L2 ➜ Left Face 180°" : "L ➜ Left Face Downwards ⬇️");
    } else if (clean.startsWith('l') || clean.startsWith('Lw')) {
      axis = 'x'; filterFn = (pos) => pos.x < 0.5; // Left 2 layers
      angle = isPrime ? -baseAngle : baseAngle;
      moveDesc = isPrime ? "l' ➜ Left TWO Layers Upwards ⬆️" : (is2 ? "l2 ➜ Left TWO Layers 180°" : "l ➜ Left TWO Layers Downwards ⬇️");
    } else if (clean.startsWith('F') && !clean.startsWith('Fw')) {
      axis = 'z'; filterFn = (pos) => pos.z > 0.5;
      angle = isPrime ? baseAngle : -baseAngle;
      moveDesc = isPrime ? "F' ➜ Front Face Counter-Clockwise ↺" : (is2 ? "F2 ➜ Front Face 180°" : "F ➜ Front Face Clockwise ↻");
    } else if (clean.startsWith('f') || clean.startsWith('Fw')) {
      axis = 'z'; filterFn = (pos) => pos.z > -0.5; // Front 2 layers
      angle = isPrime ? baseAngle : -baseAngle;
      moveDesc = isPrime ? "f' ➜ Front TWO Layers Counter-Clockwise ↺" : (is2 ? "f2 ➜ Front TWO Layers 180°" : "f ➜ Front TWO Layers Clockwise ↻");
    } else if (clean.startsWith('B') && !clean.startsWith('Bw')) {
      axis = 'z'; filterFn = (pos) => pos.z < -0.5;
      angle = isPrime ? -baseAngle : baseAngle;
      moveDesc = isPrime ? "B' ➜ Back Face Counter-Clockwise" : (is2 ? "B2 ➜ Back Face 180°" : "B ➜ Back Face Clockwise");
    } else if (clean.startsWith('b') || clean.startsWith('Bw')) {
      axis = 'z'; filterFn = (pos) => pos.z < 0.5; // Back 2 layers
      angle = isPrime ? -baseAngle : baseAngle;
      moveDesc = isPrime ? "b' ➜ Back TWO Layers Counter-Clockwise" : (is2 ? "b2 ➜ Back TWO Layers 180°" : "b ➜ Back TWO Layers Clockwise");
    } else if (clean.startsWith('M')) {
      axis = 'x'; filterFn = (pos) => Math.abs(pos.x) < 0.5;
      angle = isPrime ? -baseAngle : baseAngle;
      moveDesc = isPrime ? "M' ➜ Middle Slice Upwards ⬆️" : (is2 ? "M2 ➜ Middle Slice 180°" : "M ➜ Middle Slice Downwards ⬇️");
    } else if (clean.startsWith('y')) {
      axis = 'y'; filterFn = () => true;
      angle = isPrime ? baseAngle : -baseAngle;
      moveDesc = isPrime ? "y' ➜ Rotate Entire Cube Counter-Clockwise" : (is2 ? "y2 ➜ Rotate Entire Cube 180°" : "y ➜ Rotate Entire Cube Clockwise");
    } else if (clean.startsWith('x')) {
      axis = 'x'; filterFn = () => true;
      angle = isPrime ? baseAngle : -baseAngle;
      moveDesc = isPrime ? "x' ➜ Tilt Entire Cube Downwards" : (is2 ? "x2 ➜ Tilt Entire Cube 180°" : "x ➜ Tilt Entire Cube Upwards");
    } else if (clean.startsWith('z')) {
      axis = 'z'; filterFn = () => true;
      angle = isPrime ? baseAngle : -baseAngle;
      moveDesc = isPrime ? "z' ➜ Tilt Entire Cube Counter-Clockwise" : "z ➜ Tilt Entire Cube Clockwise";
    }

    // Show rotating face indicator (keep translateX(-50%) to prevent mobile horizontal blowout)
    const indicator = document.getElementById('vis-rotating-face');
    if (indicator) {
      indicator.innerHTML = `<strong>${clean}</strong> &bull; ${moveDesc || clean}`;
      indicator.style.opacity = '1';
      indicator.style.transform = 'translateX(-50%) translateY(0)';
    }

    // Attach matching cubies to pivot group
    this.pivot.rotation.set(0, 0, 0);
    this.pivot.position.set(0, 0, 0);
    const activeCubies = [];

    for (let i = this.cubies.length - 1; i >= 0; i--) {
      const c = this.cubies[i];
      if (filterFn(c.position)) {
        activeCubies.push(c);
        this.pivot.add(c);
      }
    }

    // Animate pivot rotation
    const startTime = performance.now();
    const duration = this.animDuration;

    const animateRotation = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(1.0, elapsed / duration);
      // Smooth sinusoidal ease-in-out (natural tactile hand turn)
      const ease = 0.5 - 0.5 * Math.cos(progress * Math.PI);
      this.pivot.rotation[axis] = angle * ease;

      if (progress < 1.0) {
        requestAnimationFrame(animateRotation);
      } else {
        // Complete the physical turn
        this.pivot.rotation[axis] = angle;
        this.isAnimating = false;

        // Apply logical move and cleanly resync all cubies
        this.cube.applyMove(move);
        this._sync3DFromCubeState();

        // Fade out indicator
        if (indicator) {
          setTimeout(() => {
            if (!this.isAnimating) {
              indicator.style.opacity = '0';
              indicator.style.transform = 'translateX(-50%) translateY(-6px)';
            }
          }, 300);
        }
        onComplete();
      }
    };

    requestAnimationFrame(animateRotation);
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
    if (!THREE) return;

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

    const size = 0.96;
    const geom = new THREE.BoxGeometry(size, size, size);
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
      ctx.fillStyle = COLORS[faces.R[r]];
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
