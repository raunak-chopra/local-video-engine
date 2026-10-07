import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {assetPaths, validateBrief} from '../scripts/validate.mjs';

const demo = JSON.parse(readFileSync(new URL('../briefs/demo.json', import.meta.url), 'utf8'));
const scene = (kind) => demo.scenes.findIndex((s) => s.kind === kind);

test('demo brief is valid', () => assert.deepEqual(validateBrief(demo), []));
test('rejects invalid timing and missing stat value', () => {
  const brief = structuredClone(demo);
  brief.scenes[0].duration = 0;
  delete brief.scenes[scene('stat')].value;
  assert.equal(validateBrief(brief).length, 2);
});
test('rejects audio paths outside public', () => {
  const brief = {...demo, audio: '../secret.mp3'};
  assert.match(validateBrief(brief).join(' '), /audio/);
});
test('checks kind-specific fields', () => {
  const brief = structuredClone(demo);
  brief.scenes[scene('list')].items = ['only one'];
  brief.scenes[scene('chart')].bars = [{label: 'A', value: -1}, {label: 'B', value: 2}];
  delete brief.scenes[scene('compare')].right;
  brief.scenes.push({kind: 'image', headline: 'Pic', src: '../x.png', duration: 2});
  const errors = validateBrief(brief).join('\n');
  for (const field of ['items', 'bars', 'right', 'src']) assert.match(errors, new RegExp(field));
});
test('checks brand options', () => {
  const brief = structuredClone(demo);
  Object.assign(brief.brand, {font: 'Comic Sans', motion: 'wild', secondary: 'blue', logo: 'logo.exe'});
  assert.equal(validateBrief(brief).length, 4);
});
test('rejects unknown transitions', () => {
  const brief = structuredClone(demo);
  brief.scenes[0].transition = 'spin';
  assert.match(validateBrief(brief).join(' '), /transition/);
});
test('lists every public asset', () => {
  const brief = {...demo, audio: 'vo.mp3', brand: {...demo.brand, logo: 'logo.png'}, scenes: [...demo.scenes, {kind: 'image', headline: 'x', src: 'a.jpg', duration: 2}]};
  assert.deepEqual(assetPaths(brief), ['vo.mp3', 'logo.png', 'a.jpg']);
});
