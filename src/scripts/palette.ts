import { SEARCH_GROUPS, type SearchItem } from '../data/search';

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

function fuzzyMatch(query: string, label: string): Match | null {
  const q = query.toLowerCase();
  const t = label.toLowerCase();
  if (q.length === 0) return { score: 0, indices: new Set() };
  const sub = t.indexOf(q);
  if (sub !== -1) {
    const indices = new Set<number>();
    for (let i = 0; i < q.length; i++) indices.add(sub + i);
    return { score: 100 + q.length, indices };
  }
  let qi = 0;
  let score = 0;
  let prev = -2;
  const indices = new Set<number>();
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] !== q[qi]) continue;
    if (i === prev + 1) score += 2;
    else if (i === 0 || t[i - 1] === ' ' || t[i - 1] === '-' || t[i - 1] === '.') score += 3;
    else score += 1;
    if (i === t.length - 1) score += 1;
    indices.add(i);
    prev = i;
    qi++;
  }
  if (qi < q.length) return null;
  return { score, indices };
}

function isTypingTarget(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  const { tagName } = t;
  if (tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT') return true;
  return t.isContentEditable;
}

export function initCommandPalette(): void {
  const overlay = document.getElementById('cmd-palette') as HTMLElement;
  const input = document.getElementById('cmd-palette-input') as HTMLInputElement;
  const results = document.getElementById('cmd-palette-results') as HTMLElement;
  if (!overlay || !input || !results) return;

  let selectedIndex = 0;
  let items: HTMLAnchorElement[] = [];
  let lastFocused: HTMLElement | null = null;

  const isOpen = () => overlay.classList.contains('active');

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

    for (const group of SEARCH_GROUPS) {
      const matched: { item: SearchItem; score: number; indices: Set<number> }[] = [];
      for (const item of group.items) {
        const m = fuzzyMatch(q, item.label);
        if (m) matched.push({ item, score: m.score, indices: m.indices });
      }
      if (matched.length === 0) continue;
      matched.sort((a, b) => b.score - a.score || a.item.label.localeCompare(b.item.label));
      const head = document.createElement('div');
      head.className = 'cmd-group-head';
      head.textContent = group.title;
      results.appendChild(head);
      for (const { item, indices } of matched) results.appendChild(makeItem(item, indices));
    }

    if (q !== '' && items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'cmd-empty';
      empty.innerHTML = `No results for <strong>&quot;${escapeHtml(q)}&quot;</strong>`;
      results.appendChild(empty);
    }

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

  function selectItem(item: HTMLAnchorElement): void {
    const action = item.dataset.action;
    if (action) {
      runAction(action);
    }
  }

  input.addEventListener('keydown', (e) => {
    if (items.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
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
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = items[selectedIndex] ?? items[0];
      selectItem(target);
      close();
      if (!target.dataset.action) window.location.assign(target.href);
    }
  });

  input.addEventListener('input', () => {
    selectedIndex = 0;
    renderResults();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  results.addEventListener('click', (e) => {
    const target = (e.target as Element).closest<HTMLAnchorElement>('.cmd-item');
    if (!target) return;
    if (target.dataset.action) {
      e.preventDefault();
      selectItem(target);
    }
    close();
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
}