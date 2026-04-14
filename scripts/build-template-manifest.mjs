#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, statSync, mkdirSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const TEMPLATE_DIR = join(ROOT, 'src', 'builder-template');
const OUT_FILE = join(ROOT, 'public', 'builder-template.json');

const TEXT_EXTENSIONS = new Set([
  '.html',
  '.css',
  '.js',
  '.txt',
  '.md',
  '.svg',
  '.json',
]);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    const s = statSync(abs);
    if (s.isDirectory()) {
      out.push(...walk(abs));
    } else if (s.isFile()) {
      out.push(abs);
    }
  }
  return out;
}

function classify(path) {
  const dot = path.lastIndexOf('.');
  const ext = dot === -1 ? '' : path.slice(dot).toLowerCase();
  return TEXT_EXTENSIONS.has(ext) ? 'text' : 'binary';
}

const files = walk(TEMPLATE_DIR).map((abs) => {
  const rel = relative(TEMPLATE_DIR, abs).split(/[\\/]/).join('/');
  const kind = classify(rel);
  if (kind === 'text') {
    return { path: rel, encoding: 'utf8', content: readFileSync(abs, 'utf8') };
  }
  return {
    path: rel,
    encoding: 'base64',
    content: readFileSync(abs).toString('base64'),
  };
});

files.sort((a, b) => a.path.localeCompare(b.path));

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(
  OUT_FILE,
  JSON.stringify({ generatedAt: new Date().toISOString(), files }, null, 2) + '\n',
);

console.log(`Wrote ${files.length} template file(s) -> ${relative(ROOT, OUT_FILE)}`);
