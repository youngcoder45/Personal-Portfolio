// Internal link audit for the static build.
// Run after `npm run build`; exits non-zero when a local href/src target or
// same-page anchor is missing.
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';

const DIST = resolve('dist');
const SKIP_PREFIXES = ['http://', 'https://', '//', 'mailto:', 'tel:', 'data:', 'javascript:'];
const SKIP_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg', '.ico',
  '.woff', '.woff2', '.ttf', '.otf', '.mp4', '.webm', '.pdf',
]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

async function isFile(path) {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
}

async function resolveTarget(sourceFile, pathname) {
  const decoded = decodeURIComponent(pathname);
  const base = decoded.startsWith('/')
    ? join(DIST, decoded)
    : resolve(dirname(sourceFile), decoded);

  const candidates = [base];
  if (decoded.endsWith('/')) candidates.push(join(base, 'index.html'));
  else {
    if (!extname(base)) {
      candidates.push(join(base, 'index.html'));
      candidates.push(`${base}.html`);
    }
  }

  for (const candidate of candidates) {
    if (await isFile(candidate)) return candidate;
  }
  return null;
}

function extractIds(html) {
  const ids = new Set();
  for (const match of html.matchAll(/\sid=["']([^"']+)["']/g)) ids.add(match[1]);
  return ids;
}

const htmlFiles = (await walk(DIST)).filter((file) => file.endsWith('.html'));
const problems = [];
let checked = 0;

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const relSource = relative(DIST, file) || 'index.html';

  for (const match of html.matchAll(/\s(?:href|src)=["']([^"']+)["']/g)) {
    const raw = match[1].trim();
    if (!raw || raw === '#' || SKIP_PREFIXES.some((prefix) => raw.startsWith(prefix))) {
      continue;
    }

    const hashIndex = raw.indexOf('#');
    const queryIndex = raw.indexOf('?');
    const cut = [hashIndex, queryIndex].filter((i) => i >= 0).sort((a, b) => a - b)[0];
    const pathname = cut === undefined ? raw : raw.slice(0, cut);
    const hash = hashIndex >= 0 ? raw.slice(hashIndex + 1) : '';

    if (!pathname && !hash) continue;

    const target = pathname
      ? await resolveTarget(file, pathname)
      : file;

    checked += 1;

    if (!target) {
      problems.push(`${relSource}: missing target for ${raw}`);
      continue;
    }

    if (hash && target.endsWith('.html')) {
      const targetHtml = target === file ? html : await readFile(target, 'utf8');
      if (!extractIds(targetHtml).has(decodeURIComponent(hash))) {
        problems.push(`${relSource}: missing anchor #${hash} in ${relative(DIST, target)}`);
      }
    }
  }

  // Catch common raw asset references inside inline styles.
  for (const match of html.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    const raw = match[1].trim();
    if (!raw || raw.startsWith('data:') || SKIP_PREFIXES.some((p) => raw.startsWith(p))) continue;
    if (SKIP_EXTENSIONS.has(extname(raw).toLowerCase())) {
      const target = await resolveTarget(file, raw);
      if (!target) problems.push(`${relSource}: missing asset ${raw}`);
    }
  }
}

if (problems.length) {
  console.error(`Link audit failed: ${problems.length} problem(s) across ${htmlFiles.length} pages`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`Link audit passed: ${checked} local references across ${htmlFiles.length} pages`);
