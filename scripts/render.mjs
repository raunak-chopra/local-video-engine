import {readFileSync, existsSync, mkdirSync} from 'node:fs';
import {resolve, dirname, relative, isAbsolute} from 'node:path';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {assetPaths, validateBrief} from './validate.mjs';

const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(name);
  return i < 0 ? undefined : args[i + 1];
};
const briefArg = option('--brief');
const outputArg = option('--output');
const browserArg = option('--browser');
if (!briefArg || !outputArg) {
  console.error('Usage: npm run render -- --brief briefs/demo.json --output out/demo.mp4');
  process.exit(2);
}

const root = resolve(import.meta.dirname, '..');
const briefPath = resolve(briefArg);
const outputPath = resolve(outputArg);
if (!existsSync(briefPath)) { console.error(`Brief not found: ${briefPath}`); process.exit(2); }
if (!outputPath.toLowerCase().endsWith('.mp4')) { console.error('Output must be an .mp4 file.'); process.exit(2); }
let brief;
try { brief = JSON.parse(readFileSync(briefPath, 'utf8')); }
catch (error) { console.error(`Cannot read brief: ${error.message}`); process.exit(2); }
const errors = validateBrief(brief);
if (errors.length) { console.error(errors.join('\n')); process.exit(2); }
const publicRoot = resolve(root, 'public');
for (const asset of assetPaths(brief)) {
  const assetPath = resolve(publicRoot, asset);
  if (isAbsolute(asset) || relative(publicRoot, assetPath).startsWith('..') || !existsSync(assetPath)) {
    console.error(`Asset not found inside public/: ${asset}`); process.exit(2);
  }
}
mkdirSync(dirname(outputPath), {recursive: true});
const require = createRequire(import.meta.url);
let cli;
try {
  const pkgPath = require.resolve('@remotion/cli/package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  cli = resolve(dirname(pkgPath), typeof pkg.bin === 'string' ? pkg.bin : pkg.bin.remotion);
} catch {
  console.error('Dependencies missing. Run npm install first.'); process.exit(2);
}
const command = [cli, 'render', resolve(root, 'src/index.ts'), 'BrandStory', outputPath, '--props', briefPath];
const installedBrowser = [
  browserArg,
  process.env.REMOTION_BROWSER_EXECUTABLE,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].find((candidate) => candidate && existsSync(candidate));
if (installedBrowser) command.push('--browser-executable', installedBrowser);
console.log(`Rendering ${brief.scenes.length} scenes to ${outputPath}`);
const result = spawnSync(process.execPath, command, {cwd: root, stdio: 'inherit'});
process.exit(result.status ?? 1);
