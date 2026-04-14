#!/usr/bin/env node
import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const src = join(ROOT, 'public', 'builder-template.json');
const dest = join(ROOT, 'builder-site', 'public', 'builder-template.json');

if (!existsSync(src)) {
  console.error(`Missing ${src}. Run "npm run builder:manifest" first.`);
  process.exit(1);
}

mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);

console.log(`Copied ${src} -> ${dest}`);
