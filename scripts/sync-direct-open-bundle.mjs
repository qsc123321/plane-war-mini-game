import { copyFileSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const tempDir = resolve(root, '.direct-open-dist');
const jsSource = resolve(tempDir, 'game.bundle.js');
const cssFileName = readdirSync(tempDir).find((file) => file.endsWith('.css'));
const jsTarget = resolve(root, 'game.bundle.js');
const cssTarget = resolve(root, 'game.bundle.css');

if (!existsSync(jsSource)) {
  throw new Error(`Missing direct-open JS bundle: ${jsSource}`);
}

if (!cssFileName) {
  throw new Error(`Missing direct-open CSS bundle in: ${tempDir}`);
}

const cssSource = resolve(tempDir, cssFileName);
copyFileSync(jsSource, jsTarget);
copyFileSync(cssSource, cssTarget);
rmSync(tempDir, { recursive: true, force: true });