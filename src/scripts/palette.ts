import { SEARCH_GROUPS, type SearchGroup, type SearchItem } from '../data/search';
import { themes } from '../data/themes';
import { apply as applyTheme } from './theme';

function loadContentGroups(): SearchGroup[] {
  const el = document.getElementById('search-content');
  if (!el?.textContent) return [];
  try {
    return JSON.parse(el.textContent) as SearchGroup[];
  } catch {
    return [];
  }
}

const SEARCH_GROUPS_ORDERED: SearchGroup[] = (() => {
  const base = [...SEARCH_GROUPS];
  const dynamic = loadContentGroups();
  const actionIdx = base.findIndex((g) => g.title === 'Actions');
  if (dynamic.length > 0 && actionIdx !== -1) base.splice(actionIdx, 0, ...dynamic);
  return base;
})();

const RECENTS_KEY = 'av-palette-recents';
const RECENTS_CAP = 5;

const ICONS: Record<string, string> = {
  home: '<path d="m3 11 9-7 9 7"/><path d="M5 10v11h14V10"/>',
  dir: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  file: '<path d="M14 3H7a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8l-4-5z"/><path d="M14 3v5h5"/>',
  note: '<path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  rss: '<path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1.5"/>',
  terminal: '<rect x="2.5" y="4" width="19" height="16" rx="2.4"/><path d="M6.5 9.5 9.5 12l-3 2.5"/><path d="M12.5 15h5"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  github:
    '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  mail: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  theme:
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
};

function svgIcon(name: string, size = 16): string {
  const path = ICONS[name] ?? ICONS.file;
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

type Match = { score: number; indices: Set<number> };

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Relevance tier for a token inside a haystack field; null when not found. */
function matchToken(token: string, field: string): number | null {
  const t = field.toLowerCase();
  const q = token.toLowerCase();
  if (q.length === 0) return 0;
  if (t === q) return 100;
  if (t.startsWith(q)) return 85;
  const sub = t.indexOf(q);
  if (sub !== -1) return 70;
  let qi = 0;
  let score = 0;
  let prev = -2;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] !== q[qi]) continue;
    if (i === prev + 1) score += 2;
    else if (i === 0 || t[i - 1] === ' ' || t[i - 1] === '-' || t[i - 1] === '.') score += 3;
    else score += 1;
    if (i === t.length - 1) score += 1;
    prev = i;
    qi++;
  }
  if (qi < q.length) return null;
  return 40 + Math.min(score, 25);
}

function fuzzyMatch(query: string, label: string, keywords: string[] = []): Match | null {
  const q = query.trim().toLowerCase();
  if (q === '') return { score: 0, indices: new Set<number>() };
  const tokens = q.split(/\s+/).filter(Boolean);
  const fields = [label, ...(keywords ?? [])].map((s) => s.toLowerCase());
  let score = 0;
  const indices = new Set<number>();
  const labelLower = label.toLowerCase();
  for (const token of tokens) {
    let bestTier = -1;
    for (const field of fields) {
      const tier = matchToken(token, field);
      if (tier === null) continue;
      if (tier > bestTier) bestTier = tier;
    }
    if (bestTier < 0) return null;
    score += bestTier;
    const start = labelLower.indexOf(token);
    for (let idx = start; idx !== -1; idx = labelLower.indexOf(token, idx + token.length)) {
      for (let i = 0; i < token.length; i++) indices.add(idx + i);
    }
  }
  return { score, indices };
}

function isTypingTarget(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  const { tagName } = t;
  if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') return true;
  return t.isContentEditable;
}

type Entry = { item: SearchItem; score: number; indices: Set<number> };

export function initCommandPalette(): void {
  const overlay = document.getElementById('cmd-palette') as HTMLElement;
  const input = document.getElementById('cmd-palette-input') as HTMLInputElement;
  const results = document.getElementById('cmd-palette-results') as HTMLElement;
  const status = document.getElementById('cmd-palette-status');
  const clear = document.getElementById('cmd-palette-clear') as HTMLButtonElement | null;
  const back = document.getElementById('cmd-palette-back') as HTMLButtonElement | null;
  if (!overlay || !input || !results) return;

  let selectedIndex = 0;
  let items: HTMLAnchorElement[] = [];
  let lastFocused: HTMLElement | null = null;
  let recents: SearchItem[] = [];

  const isOpen = () => overlay.classList.contains('active');

  function loadRecents(): SearchItem[] {
    try {
      const raw = JSON.parse(localStorage.getItem(RECENTS_KEY) ?? '[]') as SearchItem[];
      return Array.isArray(raw) ? raw.slice(0, RECENTS_CAP) : [];
    } catch {
      return [];
    }
  }

  function persistRecents(): void {
    try {
      localStorage.setItem(RECENTS_KEY, JSON.stringify(recents.slice(0, RECENTS_CAP)));
    } catch {
      /* private mode */
    }
  }

  function pushRecent(item: SearchItem): void {
    const key = item.href ?? item.action ?? item.label;
    recents = [item, ...recents.filter((r) => (r.href ?? r.action ?? r.label) !== key)].slice(0, RECENTS_CAP);
    persistRecents();
  }

  function clearRecents(): void {
    try {
      localStorage.removeItem(RECENTS_KEY);
    } catch {
      /* private mode */
    }
    recents = [];
    input.value = '';
    renderResults();
  }

  function makeItem(item: SearchItem, indices: Set<number>): HTMLAnchorElement {
    const a = document.createElement('a');
    a.className = 'cmd-item';
    a.setAttribute('role', 'option');
    a.setAttribute('aria-selected', 'false');
    a.id = `cmd-item-${items.length}`;
    if (item.href !== undefined) {
      a.href = item.href;
    } else {
      a.href = '#';
      a.dataset.action = item.action;
    }
    const label = escapeHtml(item.label);
    const icon = document.createElement('span');
    icon.className = 'cmd-icon';
    icon.innerHTML = svgIcon(item.icon);
    const text = document.createElement('span');
    text.className = 'cmd-label';
    let html = '';
    let source = 0;
    const escapedIndices = new Map<number, number>();
    for (let i = 0; i < item.label.length; i++) {
      const esc = escapeHtml(item.label[i]);
      for (let k = 0; k < esc.length; k++) escapedIndices.set(source + k, i);
      source += esc.length;
    }
    for (let i = 0; i < label.length; i++) {
      const ch = label[i];
      html += indices.has(escapedIndices.get(i) ?? i) ? `<mark>${ch}</mark>` : ch;
    }
    text.innerHTML = html;
    a.append(icon, text);
    items.push(a);
    return a;
  }

  function renderResults(): void {
    results.innerHTML = '';
    items = [];
    selectedIndex = 0;
    const q = input.value.trim();
    const rendered: { title: string; entries: Entry[] }[] = [];

    const addGroup = (title: string, list: SearchItem[]) => {
      const entries: Entry[] = [];
      for (const item of list) {
        const m = q === '' ? { score: 0, indices: new Set<number>() } : fuzzyMatch(q, item.label, item.keywords);
        if (q !== '' && !m) continue;
        entries.push({ item, score: m?.score ?? 0, indices: m?.indices ?? new Set<number>() });
      }
      if (entries.length === 0) return;
      entries.sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label));
      rendered.push({ title, entries });
    };

    if (q === '') {
      if (recents.length > 0) addGroup('Recent', recents);
    }
    for (const group of SEARCH_GROUPS_ORDERED) addGroup(group.title, group.items);

    for (const group of rendered) {
      const head = document.createElement('div');
      head.className = 'cmd-group-head';
      head.textContent = group.title;
      results.appendChild(head);
      for (const entry of group.entries) results.appendChild(makeItem(entry.item, entry.indices));
    }

    if (q !== '' && items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'cmd-empty';
      empty.innerHTML = `No results for <strong>&quot;${escapeHtml(q)}&quot;</strong>`;
      results.appendChild(empty);
    }

    if (status) status.textContent = `${items.length} result${items.length === 1 ? '' : 's'}`;
    if (clear) clear.hidden = !(q === '' && recents.length > 0);
    updateSelection();
  }

  function updateSelection(): void {
    items.forEach((it, i) => {
      const selected = i === selectedIndex && items.length > 0;
      it.classList.toggle('cmd-selected', selected);
      it.setAttribute('aria-selected', String(selected));
    });
    const active = items[selectedIndex];
    if (active) {
      input.setAttribute('aria-activedescendant', active.id);
      active.scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  }

  function runAction(name: string | undefined): void {
    if (name === 'view-source') {
      window.open('view-source:' + window.location.href, '_blank', 'noopener,noreferrer');
    } else if (name === 'copy') {
      void navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
    } else if (name === 'cycle-theme') {
      const current = document.documentElement.dataset.theme ?? 'dark';
      const idx = themes.findIndex((t) => t.id === current);
      const next = themes[(idx + 1) % themes.length];
      applyTheme(next.id);
    }
  }

  function open(): void {
    if (isOpen()) return;
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    input.value = '';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderResults();
    input.setAttribute('aria-expanded', 'true');
    window.setTimeout(() => input.focus(), 50);
  }

  function close(): void {
    if (!isOpen()) return;
    overlay.classList.remove('active');
    input.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocused && document.body.contains(lastFocused)) lastFocused.focus();
    lastFocused = null;
  }

  function goBack(): void {
    close();
    window.location.assign('/');
  }

  function selectItem(item: HTMLAnchorElement): void {
    const action = item.dataset.action as SearchItem['action'] | undefined;
    const label = item.textContent?.trim() ?? '';
    if (action) {
      pushRecent({ label, icon: 'file', action });
      runAction(action);
    } else {
      pushRecent({ label, icon: 'file', href: item.getAttribute('href') ?? '/' });
      window.location.assign(item.getAttribute('href') ?? '/');
    }
  }

  input.addEventListener('keydown', (e) => {
    if (items.length === 0) {
      if (e.key === 'Enter') e.preventDefault();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(items.length - 1, selectedIndex + 1);
      updateSelection();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(0, selectedIndex - 1);
      updateSelection();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goBack();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = items[selectedIndex] ?? items[0];
      if (!target) return;
      selectItem(target);
      close();
    }
  });

  input.addEventListener('input', () => {
    selectedIndex = 0;
    renderResults();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      close();
    }
  });

  results.addEventListener('click', (e) => {
    const target = (e.target as Element).closest<HTMLAnchorElement>('.cmd-item');
    if (!target) return;
    e.preventDefault();
    selectItem(target);
    close();
  });

  clear?.addEventListener('click', () => {
    clearRecents();
    input.focus();
  });

  back?.addEventListener('click', () => {
    goBack();
  });

  document.getElementById('cmd-palette-back')?.addEventListener('click', () => {
    goBack();
  });

  overlay.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusables = Array.from(
      overlay.querySelectorAll<HTMLElement>('input, a[href], button'),
    ).filter((n) => !n.hasAttribute('hidden'));
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey) {
      if (active === first || !overlay.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else if (active === last) {
      e.preventDefault();
      first.focus();
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (isOpen()) close();
      else open();
      return;
    }
    if (!isOpen() && e.key === '/' && !isTypingTarget(e.target)) {
      e.preventDefault();
      open();
      return;
    }
    if (isOpen() && e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  });

  document.getElementById('paletteToggle')?.addEventListener('click', () => {
    if (isOpen()) close();
    else open();
  });

  recents = loadRecents();
}
