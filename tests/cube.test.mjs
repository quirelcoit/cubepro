import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { Cube } from '../js/cube-engine.js';
import { MOVE_SPECS } from '../js/cube-moves.js';
import { CubeVisualizer } from '../js/cube-visualizer.js';
import { BEGINNER_LAST_LAYER, PLL_ALGORITHMS, F2L_CASES, WHITE_CROSS_CASES } from '../js/algorithms-data.js';

const threeContext = { exports: {}, module: {} };
runInNewContext(readFileSync(new URL('../js/three.min.js', import.meta.url), 'utf8'), threeContext);
const THREE = threeContext.exports;
let frames = [], timers = [];
globalThis.window = { THREE, matchMedia: () => ({ matches: false }) };
globalThis.document = { getElementById: () => null };
globalThis.requestAnimationFrame = fn => (frames.push(fn), frames.length);
globalThis.cancelAnimationFrame = () => {};
globalThis.setTimeout = fn => (timers.push(fn), timers.length);
globalThis.clearTimeout = () => {};

function visualizer(unique = true) {
  frames = []; timers = [];
  const v = Object.create(CubeVisualizer.prototype);
  Object.assign(v, { cube: new Cube(), scene: new THREE.Scene(), cubeGroup: new THREE.Group(), pivot: new THREE.Group(),
    geometry: new THREE.BoxGeometry(.96, .96, .96), materials: { black: new THREE.MeshBasicMaterial({ name: 'black' }) },
    animDuration: 1000, playbackSpeed: 1500, isAnimating: false, animationVersion: 0, currentStep: 0, moves: [],
    onStepChange: () => {}, onStateChange: () => {}, render2D: () => {} });
  v.scene.add(v.cubeGroup, v.pivot);
  for (const face in v.cube.faces) for (let i = 0; i < 9; i++) {
    const key = unique ? face + i : face;
    v.cube.faces[face][i] = key;
    v.materials[key] = new THREE.MeshBasicMaterial({ name: key });
  }
  v.initialState = v.cube.clone();
  v._sync3DFromCubeState();
  return v;
}

function snapshot(v) {
  v.scene.updateMatrixWorld(true);
  const result = {};
  const normals = [[1,0,0], [-1,0,0], [0,1,0], [0,-1,0], [0,0,1], [0,0,-1]];
  for (const c of v.cubies) {
    const p = c.getWorldPosition(new THREE.Vector3()).toArray().map(Math.round);
    const q = c.getWorldQuaternion(new THREE.Quaternion());
    c.material.forEach((m, i) => {
      if (m.name === 'black') return;
      const n = new THREE.Vector3(...normals[i]).applyQuaternion(q).toArray().map(Math.round);
      result[[...p, ...n].join(',')] = m.name;
    });
  }
  return result;
}

const bases = [...Object.keys(MOVE_SPECS), ...'URFDLB'.split('').map(f => f + 'w')];
test('physical animation endpoint agrees with logical stickers for every supported move', () => {
  for (const base of bases) for (const suffix of ['', "'", '2']) {
    const move = base + suffix, v = visualizer();
    const now = performance.now();
    v.rotateLayer3D(move, () => {});
    frames.shift()(now + 999.99);
    const physical = snapshot(v);
    frames.shift()(now + 1001);
    assert.deepEqual(snapshot(v), physical, move);
  }
});

test('known Singmaster directions and wide-layer equivalences', () => {
  const c = new Cube(); c.applyMove('R');
  assert.deepEqual([c.faces.U[2], c.faces.F[2], c.faces.D[2], c.faces.B[0]], ['F','D','B','U']);
  const u = new Cube(); u.applyMove('U');
  assert.deepEqual(u.faces.F.slice(0,3), ['R','R','R']);
  const z = new Cube(); z.applyMove('z');
  assert.deepEqual([z.faces.U[4], z.faces.R[4], z.faces.D[4], z.faces.L[4]], ['L','U','R','D']);
  for (const [move, composition] of [['r', "R M'"], ['l', 'L M'], ['u', "U E'"], ['d', 'D E'], ['f', 'F S'], ['b', "B S'"], ['x', "R M' L'"], ['y', "U E' D'"], ['z', "F S B'"]]) {
    const a = visualizer().cube, b = a.clone();
    a.applyMove(move); b.applyAlgorithm(composition); assert.deepEqual(a.faces, b.faces, move);
  }
});

test('inverse and four-turn identities preserve every sticker', () => {
  for (const move of bases) {
    const c = visualizer().cube, initial = c.clone();
    c.applyAlgorithm(`${move} ${move}'`); assert.deepEqual(c.faces, initial.faces);
    c.applyAlgorithm(`${move} ${move} ${move} ${move}`); assert.deepEqual(c.faces, initial.faces);
  }
});

test('parser expands groups, rejects invalid notation atomically, normalizes primes', () => {
  assert.equal(Cube.parseAlgorithm("(R U R' U')6").length, 24);
  assert.deepEqual(Cube.parseAlgorithm('R’ U2\' (F B)2'), ["R'",'U2','F','B','F','B']);
  for (const bad of ['R nope', '(R', 'R)', '(R)0', '(R)101', '[R,U]', 'R 6']) assert.throws(() => Cube.parseAlgorithm(bad));
  const c = new Cube(), initial = c.clone();
  assert.throws(() => c.applyAlgorithm('R invalid')); assert.deepEqual(c.faces, initial.faces);
  c.applyAlgorithm("(R U R' U')6"); assert.deepEqual(c.faces, initial.faces);
});

test('reset, seek and case replacement invalidate callbacks already queued', () => {
  for (const change of [v => v.reset(), v => v.seek(1), v => v.setAlgorithm('F U')]) {
    const v = visualizer(false); v.setAlgorithm('R U'); v.stepForward();
    const stale = frames.shift(); change(v);
    const state = JSON.stringify(v.cube.faces), step = v.currentStep;
    stale(performance.now() + 1100);
    assert.equal(JSON.stringify(v.cube.faces), state); assert.equal(v.currentStep, step);
  }
});

test('replay, pause/resume during a turn, and speed changes keep playback coherent', () => {
  const v = visualizer(false); v.setAlgorithm('R U'); v.seek(2); v.play();
  assert.equal(v.isPlaying, true); assert.equal(v.currentStep, 0);
  v.pause(); v.setSpeed(800); v.play();
  frames.shift()(performance.now() + 1100);
  assert.equal(v.currentStep, 1); assert.equal(timers.length, 1);
  timers.shift()(); frames.shift()(performance.now() + 1100);
  assert.equal(v.currentStep, 2); assert.equal(v.isPlaying, false);
});

test('all executable library algorithms and setups use supported notation', () => {
  const cases = [...BEGINNER_LAST_LAYER.flatMap(g => g.cases), ...PLL_ALGORITHMS, ...F2L_CASES, ...WHITE_CROSS_CASES];
  for (const item of cases) {
    assert.ok(Cube.parseAlgorithm(item.recommendedAlg || item.alg).length, item.id);
    if (item.setup) assert.ok(Cube.parseAlgorithm(item.setup).length, item.id);
  }
});
