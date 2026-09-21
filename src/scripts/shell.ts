/**
 * aditya-shell — a small interactive terminal for the landing page.
 * Vanilla TS, no deps. The only "real" client interaction on the site.
 * Falls back to an instant render when the user prefers reduced motion,
 * and the server renders a full `<noscript>` fallback too.
 */
import { identity, neofetch, rig, socials, tagline } from '../lib/profile';
import { skillGroups } from '../data/skills';
import { linuxHelp, runLinux } from './linux';

type Row = { text: string; cls?: string; href?: string; title?: string };

const termBody = document.getElementById('termBody');

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

/* ------------- neofetch block ------------- */

function renderNeofetch(target: HTMLElement) {
  const neo = el('div', 'neo');
  const art = el('pre', 'neo-art');
  art.textContent = neofetch.art.join('\n');
  const info = el('div', 'neofetch');
  const head = el('div', 'row');
  head.append(el('strong', 'lbl', neofetch.label));
  head.append(el('span', undefined, '  ───────────────────'));
  info.append(head);

  for (const line of neofetch.info) {
    const [k, ...rest] = line.split(/ {2,}/);
    const row = el('div', 'row');
    row.append(el('span', 'lbl', k.padEnd(9)));
    row.append(el('span', 'sep', ' │ '));
    row.append(el('span', undefined, rest.join(' ')));
    info.append(row);
  }

  const div = el('div', 'row');
  div.append(el('span', undefined, `${' '.repeat(10)}├───────────┤`));
  info.append(div);

  const colors = el('div', 'row');
  colors.append(el('span', 'lbl', 'Colors'.padEnd(9)));
  colors.append(el('span', 'sep', ' │ '));
  const dots = el('span');
  for (const c of neofetch.colors) {
    const dot = el('span', 'cdot', '●');
    dot.style.color = c;
    dots.append(dot);
    dots.append(document.createTextNode(' '));
  }
  colors.append(dots);
  info.append(colors);

  neo.append(art, info);
  target.append(neo);
}

/* ------------- command output builders ------------- */

function appendOut(parent: HTMLElement, rows: (Row | string)[]) {
  const wrap = el('div', 'res');
  for (const r of rows) {
    if (typeof r === 'string') {
      wrap.append(el('div', undefined, r));
      continue;
    }
    const line = el('div', r.cls ?? '');
    if (r.href) {
      const a = el('a', undefined, r.text);
      a.href = r.href;
      if (r.title) a.title = r.title;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      line.append(a);
    } else {
      line.textContent = r.text;
    }
    wrap.append(line);
  }
  parent.append(wrap);
  if (termBody) termBody.scrollTop = termBody.scrollHeight;
}

function kvRows(kvs: [string, string][]): Row[] {
  return kvs.map(([k, v]) => ({ text: `${k.padEnd(13)} ${v}` }));
}

/* ------------- commands ------------- */

type CmdOut = (Row | string)[];
type Cmd = (args: string[]) => CmdOut;

const helpCmd: Cmd = () => [
  { cls: 'dim', text: 'aditya-shell v1.0 · systems-flavoured TUI · try:' },
  '',
  { text: '  help          show this help', cls: 'dim' },
  { text: '  whoami        who is aditya?', cls: 'dim' },
  { text: '  skills        the toolchain', cls: 'dim' },
  { text: '  projects      featured work', cls: 'dim' },
  { text: '  notes         technical notes', cls: 'dim' },
  { text: '  neofetch      reprint system info', cls: 'dim' },
  { text: '  env           current rig', cls: 'dim' },
  { text: '  contact       find me elsewhere', cls: 'dim' },
  { text: '  date   echo   arch', cls: 'dim' },
  { text: '  clear         wipe the screen', cls: 'dim' },
  '',
  ...linuxHelp(),
  '',
  { cls: 'dim', text: 'hidden: sudo rm -rf /  (do not)' },
];

const whoamiCmd: Cmd = () => [
  { cls: 'ok', text: `${identity.name}` },
  { cls: 'dim', text: identity.title },
  '',
  ...kvRows([
    ['Role', 'Electronics Engineering Student'],
    ['Stack', 'C · C++ · Rust · Python'],
    ['Home', 'Mumbai, India'],
    ['Eth', 'Systems, Embedded, FOSS'],
    ['Goal', 'ai × embedded, shipped'],
    ['Motto', tagline.join(' ')],
  ]),
];

const skillsCmd: Cmd = (args) => {
  const group = args[0]?.toLowerCase();
  const g = group
    ? skillGroups.find((x) => x.id.startsWith(group))
    : undefined;
  const list = g ? [g] : skillGroups;
  const rows: CmdOut = [];
  for (const grp of list) {
    rows.push({ cls: 'ok', text: `~ ${grp.title} :: ${grp.path}` });
    rows.push(...grp.skills.map((s) => ({ text: `  ${s.name.padEnd(16)} ${s.spec}`, cls: 'dim' as const })));
    rows.push('');
  }
  rows.push({ cls: 'dim', text: 'usage: skills [systems|embedded|backend|data|web|devops]' });
  return rows;
};

const projectsCmd: Cmd = () => [
  { cls: 'dim', text: 'featured — full list at /projects' },
  '',
  { text: '  niri-utils                 rust · wayland tooling', cls: 'dim' },
  { text: '  EclipseLinux               lua/void · distro', cls: 'dim' },
  { text: '  Student-Performance-Pred.. python · ml', cls: 'dim' },
  { text: '  Eigen-Bot                  python · discord', cls: 'dim' },
  { text: '  OpenCV-Math-Solver         python · vision', cls: 'dim' },
  { text: '  Discord-Server-Exporter..  python · api dumps', cls: 'dim' },
  { text: '  CodeVerseHub-Website       ts/next · org site', cls: 'dim' },
  { text: '  discord-matrix-bridge      ts · federation', cls: 'dim' },
  '',
  { text: 'open /projects →', href: '/projects', title: '/projects' },
];

const notesCmd: Cmd = () => [
  { cls: 'dim', text: 'field notes from O(machine).' },
  '',
  { text: 'open /notes →', href: '/notes', title: '/notes' },
];

const neofetchCmd: Cmd = () => [
  { text: neofetch.art.join('\n'), cls: 'ok' },
  '',
  { text: `${neofetch.label}  ───────────────────`, cls: 'lbl' },
  ...neofetch.info.map((l) => ({ text: l, cls: 'dim' as const })),
  { text: `${' '.repeat(10)}├───────────┤`, cls: 'dim' },
  { text: `${'Colors'.padEnd(12)}${neofetch.colors.map(() => '●').join(' ')}`, cls: 'dim' },
];

const envCmd: Cmd = () => kvRows([...rig.map(([k, v]) => [k, v] as [string, string])]);

const contactCmd: Cmd = () => {
  const rows: CmdOut = [];
  for (const s of socials) {
    rows.push({ text: `  ${s.label.padEnd(10)} ${s.hint}`, href: s.href, title: s.hint });
  }
  return rows;
};

const dateCmd: Cmd = () => [new Date().toString()];

function run(cmd: string, args: string[]): { rows: CmdOut; cls?: string } | null {
  switch (cmd) {
    case 'help':
      return { rows: helpCmd(args) };
    case 'whoami':
    case 'about':
      return { rows: whoamiCmd(args) };
    case 'skills':
    case 'stack':
    case 'toolchain':
      return { rows: skillsCmd(args) };
    case 'projects':
    case 'ls-project':
    case 'repos':
      return { rows: projectsCmd(args) };
    case 'notes':
    case 'log':
      return { rows: notesCmd(args) };
    case 'neofetch':
    case 'fastfetch':
      return { rows: neofetchCmd(args) };
    case 'env':
    case 'systeminfo':
      return { rows: envCmd(args) };
    case 'contact':
    case 'social':
    case 'matrix':
      return { rows: contactCmd(args) };
    case 'date':
      return { rows: dateCmd(args) };
    case 'echo':
      return { rows: args.length ? [args.join(' ')] : [''] };
    case 'arch':
      return { rows: [{ cls: 'dim', text: 'btw. if you meant the distro, try "neofetch".' }] };
    case 'version':
    case '--version':
      return { rows: ['aditya-shell v1.0.0 (build astro-5)'] };
    case 'pty':
    case 'ssh':
      return { rows: [{ cls: 'dim', text: 'aditya@localhost: Connection established. but also: no.' }] };
    case 'sudo':
      return handleSudo(args);
    case 'yes':
      return { rows: Array.from({ length: 4 }, () => 'y') };
    default: {
      const rows = runLinux(cmd, args, history);
      return rows ? { rows } : null;
    }
  }
}

function handleSudo(args: string[]): { rows: CmdOut } {
  const joined = args.join(' ');
  if (joined === '-rf /' || joined === 'rm -rf /') {
    return {
      rows: [{ cls: 'err', text: 'permission denied: nice try. i like this machine.' }],
    };
  }
  return { rows: [{ cls: 'dim', text: `${identity.name} is not in the sudoers file. this incident will be reported.` }] };
}

/* ------------- prompt / io ------------- */

const history: string[] = [];
let histIdx = 0;
let outEl: HTMLElement | null = null;
let inputEl: HTMLInputElement | null = null;

function promptLabel() {
  return `aditya@arch:~/dev/portfolio$ `;
}

function initPrompt(container: HTMLElement) {
  outEl = el('div', 'out');
  const line = el('div', 'line prompt');
  const ps = el('span', 'ps', promptLabel());
  line.append(ps);
  const input = el('input', 'tty-input');
  input.type = 'text';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.setAttribute('aria-label', 'shell command');
  inputEl = input;
  line.append(input);
  container.append(outEl, line);
  input.focus();
  if (termBody) termBody.scrollTop = termBody.scrollHeight;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = input.value.trim();
      if (val) {
        history.push(val);
        histIdx = history.length;
      }
      pushOut(el('div', 'echo', `${promptLabel()}${input.value}`));
      if (val) handle(val);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx > 0) histIdx -= 1;
      input.value = history[histIdx] ?? '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx < history.length) histIdx += 1;
      input.value = history[histIdx] ?? '';
    }
  });
}

function pushOut(node: HTMLElement) {
  if (outEl) outEl.append(node);
  if (termBody) termBody.scrollTop = termBody.scrollHeight;
}

function handle(raw: string) {
  if (!outEl) return;
  if (raw === 'clear') {
    outEl.textContent = '';
    return;
  }
  const parts = raw.split(/\s+/);
  const [cmd, ...args] = parts;
  const res = run((cmd ?? '').toLowerCase(), args);
  if (!res) {
    pushOut(el('div', 'res err', `bash: ${cmd}: command not found`));
    return;
  }
  appendOut(outEl, res.rows);
}

/* ------------- boot sequence ------------- */

function boot() {
  if (!termBody) return;
  renderNeofetch(termBody);
  initPrompt(termBody);
}

boot();

/* focus management */
termBody?.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.closest('button, a')) return;
  inputEl?.focus();
});