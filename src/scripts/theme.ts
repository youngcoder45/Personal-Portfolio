import { themes } from '../data/themes';

const KEY = 'av-theme';
const root = document.documentElement;
const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');

function current(): string {
  return (root.dataset.theme as string | undefined) || 'dark';
}

function syncIcon(t: string) {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const th = themes.find((x) => x.id === t);
  btn.innerHTML = th?.mode === 'light' ? '&#9788;' : '&#9790;';
}

function apply(t: string) {
  root.dataset.theme = t;
  try {
    localStorage.setItem(KEY, t);
  } catch {
    /* private mode */
  }
  const th = themes.find((x) => x.id === t);
  metas.forEach((m) => (m.content = th?.swatch[0] ?? '#0b0f14'));
  document.querySelectorAll<HTMLButtonElement>('.theme-option').forEach((opt) => {
    const active = opt.dataset.theme === t;
    opt.classList.toggle('active', active);
    opt.setAttribute('aria-selected', String(active));
  });
  syncIcon(t);
}

function setOpen(open: boolean) {
  const menu = document.getElementById('themeMenu');
  const btn = document.getElementById('themeToggle');
  if (!menu || !btn) return;
  menu.hidden = !open;
  btn.setAttribute('aria-expanded', String(open));
}

function init() {
  const btn = document.getElementById('themeToggle');
  const menu = document.getElementById('themeMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(menu.hidden);
  });

  menu.addEventListener('click', (e) => {
    const opt = (e.target as Element).closest<HTMLButtonElement>('.theme-option');
    if (!opt) return;
    const id = opt.dataset.theme;
    if (id && themes.some((x) => x.id === id)) apply(id);
    setOpen(false);
    btn.focus();
  });

  document.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('.theme-picker')) setOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  apply(current());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}