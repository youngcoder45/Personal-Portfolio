// Generates public/og.png — the 1200x630 social preview card.
// Rendered from an inline SVG using the site's design tokens (see global.css).
// Run automatically before `astro build` via the `prebuild` npm script.
import { writeFile, mkdir } from 'node:fs/promises';

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.warn('sharp unavailable — keeping existing public/og.png');
  process.exit(0);
}

const W = 1200;
const H = 630;

const BG = '#0b0f14';
const BG_2 = '#0f141b';
const BORDER = '#1d2834';
const BORDER_HI = '#31414f';
const FG = '#c3cdd8';
const FG_STRONG = '#e7edf3';
const FG_DIM = '#78879b';
const GREEN = '#4ade80';
const BLUE = '#67a7f0';
const MAGENTA = '#c780dd';
const GRID = 'rgba(140, 165, 190, 0.05)';
const MONO =
  '"FiraCode Nerd Font Propo", "Fira Code", "JetBrains Mono", "DejaVu Sans Mono", monospace';

const boxes = [
  { text: 'rust', color: '#c3cdd8' },
  { text: 'niri', color: '#c3cdd8' },
  { text: 'zsh', color: '#c3cdd8' },
];

function windowChrome() {
  return `
  <rect x="56" y="56" width="1088" height="518" rx="10" fill="${BG}" stroke="${BORDER}" stroke-width="2"/>
  <rect x="58" y="58" width="1084" height="50" rx="9" fill="${BG_2}" stroke="${BORDER}"/>
  <circle cx="82" cy="83" r="6" fill="#e06c75"/>
  <circle cx="104" cy="83" r="6" fill="#e7c66b"/>
  <circle cx="126" cy="83" r="6" fill="#4ade80"/>
  <text x="148" y="90" font-family='${MONO}' font-size="17" fill="${FG_DIM}">aditya@arch: ~/dev/portfolio</text>
  <text x="1124" y="90" font-family='${MONO}' font-size="16" fill="${FG_DIM}" text-anchor="end">tty1 · niri · aditya-verma.me</text>`;
}

function boxesRow(x, y, w, h) {
  return boxes
    .map((b, i) => {
      const bx = x + i * (w + 10);
      return `<rect x="${bx}" y="${y}" width="${w}" height="${h}" rx="5" fill="${BG_2}" stroke="${BORDER_HI}"/>
      <text x="${bx + w / 2}" y="${y + h - 7}" font-family='${MONO}' font-size="15" fill="${b.color}" text-anchor="middle">${b.text}</text>`;
    })
    .join('\n  ');
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
      <path d="M 26 0 L 0 0 0 26" fill="none" stroke="${GRID}" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>

  ${windowChrome()}

  <text x="84" y="168" font-family='${MONO}' font-size="21" fill="${FG_DIM}">$ whoami</text>

  <text x="84" y="258" font-family='${MONO}' font-size="26" fill="${GREEN}">❯</text>
  <text x="122" y="256" font-family='${MONO}' font-size="72" fill="${FG_STRONG}">Aditya Verma</text>
  <rect x="760" y="198" width="26" height="52" fill="${GREEN}" rx="2"/>
  <rect x="792" y="198" width="6" height="52" fill="${GREEN}"/>

  <text x="122" y="316" font-family='${MONO}' font-size="33" fill="${GREEN}">Systems &amp; Backend Developer</text>

  <text x="122" y="366" font-family='${MONO}' font-size="22" fill="${FG}">C · C++ · Rust · Python · Linux · ESP32 · FOSS</text>

  <line x1="122" y1="402" x2="1078" y2="402" stroke="${BORDER}" stroke-width="2"/>

  ${boxesRow(122, 424, 62, 28)}

  <text x="929" y="430" font-family='${MONO}' font-size="18" fill="${FG_DIM}">thecodeversehub.tech</text>
  <text x="929" y="452" font-family='${MONO}' font-size="18" fill="${FG_DIM}">code. study. research. repeat.</text>

  <text x="122" y="520" font-family='${MONO}' font-size="22" fill="${BLUE}">https://aditya-verma.me</text>
  <text x="1078" y="520" font-family='${MONO}' font-size="22" fill="${MAGENTA}" text-anchor="end">@youngcoder45</text>
</svg>`;

await mkdir('public', { recursive: true });
const png = await sharp(Buffer.from(svg)).png().toBuffer();
await writeFile('public/og.png', png);
console.log(`og.png written: ${png.length} bytes`);