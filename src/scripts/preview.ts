/**
 * Akoder-style hover preview for project cards with a live site.
 *
 * Hovering the "live ↗" link on a card floats a small terminal-styled
 * preview near the cursor, built from the card's own server-rendered data
 * (title, blurb, stack, demo URL). The real site itself cannot be embedded:
 * the demo host sends `x-frame-options: DENY`, and no third-party screenshot
 * service is used — so the preview is an honest summary card, not an image.
 *
 * Progressive enhancement only: the module runs when JS loads, and the card
 * only appears for genuine mouse hover (`pointerType: 'mouse'`) — touch and
 * pen pointers never spawn it, and keyboard users keep the plain link.
 * Display toggles only — no animation, so `prefers-reduced-motion` needs no
 * special-casing.
 */

const SELECTOR = 'a[data-live]';

function stripPrompt(text: string): string {
  return text.replace(/^>\s*_\s*/, '').trim();
}

export function initLivePreview(): void {
  let card: HTMLElement | null = null;
  let anchor: HTMLAnchorElement | null = null;

  function build(a: HTMLAnchorElement): HTMLElement {
    const host = a.closest<HTMLElement>('[data-project]');
    const el = document.createElement('div');
    el.className = 'live-preview';
    el.setAttribute('aria-hidden', 'true');

    const url = a.dataset.live ?? a.href;
    let domain = url;
    try {
      domain = new URL(url).hostname;
    } catch {
      /* keep raw href */
    }

    const bar = document.createElement('div');
    bar.className = 'lp-bar';
    const dot = document.createElement('span');
    dot.className = 'lp-dot';
    dot.textContent = '●';
    const path = document.createElement('span');
    path.className = 'lp-path';
    path.textContent = domain;
    const badge = document.createElement('span');
    badge.className = 'lp-badge';
    badge.textContent = 'live';
    bar.append(dot, path, badge);

    const body = document.createElement('div');
    body.className = 'lp-body';

    const title = host?.querySelector<HTMLElement>('.card-title');
    if (title) {
      const h = document.createElement('span');
      h.className = 'lp-title';
      h.textContent = stripPrompt(title.textContent ?? '');
      body.appendChild(h);
    }
    const blurb = host?.querySelector<HTMLElement>('.blurb');
    if (blurb?.textContent) {
      const p = document.createElement('span');
      p.className = 'lp-blurb';
      p.textContent = blurb.textContent.trim();
      body.appendChild(p);
    }
    const chips = Array.from(host?.querySelectorAll<HTMLElement>('.chip') ?? [])
      .slice(0, 4)
      .map((c) => c.textContent?.trim() ?? '')
      .filter(Boolean);
    if (chips.length > 0) {
      const row = document.createElement('span');
      row.className = 'lp-chips';
      for (const chip of chips) {
        const tag = document.createElement('span');
        tag.className = 'lp-chip';
        tag.textContent = chip;
        row.appendChild(tag);
      }
      body.appendChild(row);
    }

    const foot = document.createElement('div');
    foot.className = 'lp-foot';
    foot.textContent = '↗ opens in a new tab';

    el.append(bar, body, foot);
    return el;
  }

  function place(x: number, y: number): void {
    if (!card) return;
    const pad = 16;
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    let left = x + pad;
    let top = y + pad;
    if (left + w + pad > window.innerWidth) left = x - w - pad;
    if (top + h + pad > window.innerHeight) top = y - h - pad;
    card.style.left = `${Math.max(pad, left)}px`;
    card.style.top = `${Math.max(pad, top)}px`;
  }

  function show(a: HTMLAnchorElement, x: number, y: number): void {
    if (card) card.remove();
    card = build(a);
    anchor = a;
    document.body.appendChild(card);
    place(x, y);
  }

  function hide(): void {
    card?.remove();
    card = null;
    anchor = null;
  }

  document.addEventListener('pointerover', (e) => {
    if (e.pointerType !== 'mouse') return;
    const target = (e.target as Element | null)?.closest<HTMLAnchorElement>(SELECTOR);
    if (!target || !target.closest('[data-project]')) return;
    show(target, e.clientX, e.clientY);
  });

  document.addEventListener('pointermove', (e) => {
    if (!card || !anchor || e.pointerType !== 'mouse') return;
    if (!(e.target as Element | null)?.closest?.(SELECTOR)) return;
    place(e.clientX, e.clientY);
  });

  document.addEventListener('pointerout', (e) => {
    if (!card) return;
    const from = e.target as Element | null;
    const to = e.relatedTarget as Element | null;
    if (from?.closest(SELECTOR) && !to?.closest(SELECTOR)) hide();
  });

  document.addEventListener('scroll', hide, { passive: true, capture: true });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide();
  });
}
