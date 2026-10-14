import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { Cube } from '../js/cube-engine.js';
import { STAGES, LEVELS, getLessonCases, nextLesson } from '../js/curriculum.js';
import { BEGINNER_LAST_LAYER, PLL_ALGORITHMS, F2L_CASES, WHITE_CROSS_CASES } from '../js/algorithms-data.js';
const { resolveAsset } = createRequire(import.meta.url)('../scripts/serve.cjs');
const solved = c => Object.values(c.faces).every(face => face.every(x => x === face[4]));

test('all 12 lessons contain a goal, practice, readiness check and valid cases', () => {
  for (const [stage, data] of Object.entries(STAGES)) for (const level of LEVELS) {
    const lesson = data.levels[level], cases = getLessonCases(stage, level);
    assert.ok(data.goal && lesson.drill && lesson.ready && lesson.steps.length === 3);
    assert.ok(cases.length > 0); assert.equal(new Set(cases.map(c => c.id)).size, cases.length);
    const next = nextLesson(stage, level); assert.ok(STAGES[next.stage] && LEVELS.includes(next.level));
  }
  assert.deepEqual(Object.keys(STAGES), ['cross','f2l','oll','pll']);
  assert.equal(getLessonCases('oll','beginner').length, 10);
  assert.equal(getLessonCases('pll','beginner').length, 6);
  assert.equal(getLessonCases('pll','intermediate').length, 21);
  assert.equal(getLessonCases('f2l','pro').length, 41);
  assert.match(STAGES.oll.levels.pro.coverage, /not yet in the offline library/);
  assert.throws(() => getLessonCases('unknown', 'beginner'));
});

test('last-layer examples preserve F2L and reach a solved example', () => {
  for (const item of [...BEGINNER_LAST_LAYER.flatMap(g => g.cases), ...PLL_ALGORITHMS]) {
    const c = new Cube(); c.applyAlgorithm(item.setup || Cube.invertAlgorithm(item.recommendedAlg));
    assert.ok(c.faces.D.every(x => x === c.faces.D[4]), item.id + ' bottom');
    for (const f of ['F','B','L','R']) assert.ok(c.faces[f].slice(3).every(x => x === c.faces[f][4]), item.id + ' lower ' + f);
    if (item.id.startsWith('pll-') || ['CP','EP'].includes(item.type)) assert.ok(c.faces.U.every(x => x === c.faces.U[4]), item.id + ' oriented top');
    c.applyAlgorithm(item.recommendedAlg); assert.ok(solved(c), item.id + ' completion');
  }
});

test('F2L prepared examples finish solved; daisy examples match their stated goal', () => {
  for (const item of F2L_CASES) {
    const c = new Cube(); c.applyAlgorithm(item.setup || Cube.invertAlgorithm(item.recommendedAlg));
    c.applyAlgorithm(item.recommendedAlg); assert.ok(solved(c), item.id);
  }
  for (const item of WHITE_CROSS_CASES.filter(c => c.tier === 'beginner')) {
    const c = new Cube(); c.applyAlgorithm(item.setup); c.applyAlgorithm(item.recommendedAlg);
    const face = item.id === 'cross-beg-5' ? 'D' : 'U';
    assert.ok([1,3,5,7].every(i => c.faces[face][i] === 'D'), item.id);
  }
});

test('local preview serves only supported workspace assets', () => {
  assert.ok(resolveAsset('/').endsWith('index.html'));
  assert.ok(resolveAsset('/js/app.js?dev').endsWith('app.js'));
  assert.ok(resolveAsset('/robots.txt').endsWith('robots.txt'));
  assert.ok(resolveAsset('/sitemap.xml').endsWith('sitemap.xml'));
  assert.equal(resolveAsset('/.git/config'), null);
  assert.equal(resolveAsset('/%2e%2e%5csecret.json'), null);
  assert.equal(resolveAsset('/README.md'), null);
  assert.throws(() => resolveAsset('/%ZZ'));
});


test('offline release precaches new modules and never refreshes a cached module separately', async () => {
  const handlers = {}, assets = [], deleted = [];
  const cached = { body: 'release-module' };
  const cache = { addAll: async list => assets.push(...list), match: async () => cached };
  let networkCalls = 0;
  const context = {
    self: { addEventListener: (name, fn) => handlers[name] = fn, skipWaiting: () => {}, clients: { claim: () => {} }, location: { origin: 'http://localhost' } },
    caches: { open: async () => cache, keys: async () => ['speedcube-pro-v7','speedcube-pro-v8','another-app'], delete: async key => deleted.push(key) },
    fetch: async () => { networkCalls++; }, URL, Response
  };
  runInNewContext(readFileSync(new URL('../sw.js', import.meta.url), 'utf8'), context);
  let task;
  handlers.install({ waitUntil: promise => task = promise }); await task;
  for (const asset of assets) assert.ok(existsSync(new URL('../' + asset, import.meta.url)), asset);
  for (const asset of ['./js/curriculum.js','./js/cube-moves.js','./css/learning.css']) assert.ok(assets.includes(asset));
  handlers.activate({ waitUntil: promise => task = promise }); await task;
  assert.deepEqual(deleted, ['speedcube-pro-v7']);
  handlers.fetch({ request: { method: 'GET', url: 'http://localhost/js/app.js' }, respondWith: promise => task = promise });
  assert.equal(await task, cached); assert.equal(networkCalls, 0);
});
