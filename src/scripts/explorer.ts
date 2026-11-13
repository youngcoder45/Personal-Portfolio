// Progressive enhancement for the project explorer. Every project is already in
// the HTML; this only hides non-matching cards, keeps the URL in sync, and
// remembers the last filter set so project pages can link back to it.

type Dimension = 'category' | 'year' | 'status' | 'featured';

const DIMENSIONS: Dimension[] = ['category', 'year', 'status', 'featured'];
const STORE_KEY = 'av-projects-filter';

const root = document.querySelector<HTMLElement>('[data-explorer]');
if (root) {
  const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-project]'));
  const groups = Array.from(root.querySelectorAll<HTMLDetailsElement>('[data-year-group]'));
  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-filter]'));
  const resets = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-explorer-reset]'));
  const count = root.querySelector<HTMLElement>('[data-explorer-count]');
  const query = root.querySelector<HTMLElement>('[data-explorer-query]');
  const empty = root.querySelector<HTMLElement>('[data-explorer-empty]');
  const list = root.querySelector<HTMLElement>('[data-explorer-list]');
  const total = Number(root.dataset.total ?? cards.length);

  const state: Record<Dimension, string> = {
    category: '',
    year: '',
    status: '',
    featured: '',
  };

  const exists = (dimension: Dimension, value: string) =>
    cards.some((card) => (card.dataset[dimension] ?? '') === value);

  const readUrl = () => {
    const params = new URLSearchParams(window.location.search);
    for (const dimension of DIMENSIONS) {
      const value = params.get(dimension) ?? '';
      // Ignore values that match nothing, so hand-edited URLs fail visibly
      // rather than rendering a blank page.
      state[dimension] = value && exists(dimension, value) ? value : '';
    }
  };

  const activeFilters = () => DIMENSIONS.filter((dimension) => state[dimension]);

  const matches = (card: HTMLElement) =>
    DIMENSIONS.every(
      (dimension) => !state[dimension] || (card.dataset[dimension] ?? '') === state[dimension],
    );

  const search = () => {
    const params = new URLSearchParams();
    for (const dimension of DIMENSIONS) {
      if (state[dimension]) params.set(dimension, state[dimension]);
    }
    return params.toString();
  };

  const apply = () => {
    let visible = 0;
    for (const card of cards) {
      const show = matches(card);
      card.hidden = !show;
      if (show) visible += 1;
    }

    const filtering = activeFilters().length > 0;
    for (const group of groups) {
      const shown = Array.from(group.querySelectorAll<HTMLElement>('[data-project]')).filter(
        (card) => !card.hidden,
      ).length;
      group.hidden = shown === 0;
      const counter = group.querySelector<HTMLElement>('[data-group-count]');
      if (counter) counter.textContent = String(shown);
      // A filtered result inside a collapsed year should not stay out of sight.
      if (filtering && shown > 0) group.open = true;
    }

    for (const button of buttons) {
      const dimension = button.dataset.filter as Dimension | undefined;
      if (!dimension) continue;
      const pressed = (state[dimension] ?? '') === (button.dataset.value ?? '');
      button.setAttribute('aria-pressed', String(pressed));
    }

    if (count) count.textContent = `${visible} / ${total} projects`;
    if (empty) empty.hidden = visible > 0;
    if (list) list.hidden = visible === 0;
    if (query) {
      const active = activeFilters();
      query.textContent = active.length
        ? `# ${active.map((dimension) => `${dimension}=${state[dimension]}`).join(' ')}`
        : '';
    }

    const params = search();
    const url = `${window.location.pathname}${params ? `?${params}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', url);
    try {
      if (params) sessionStorage.setItem(STORE_KEY, params);
      else sessionStorage.removeItem(STORE_KEY);
    } catch {
      /* private mode */
    }
  };

  const setFilter = (dimension: Dimension, value: string) => {
    state[dimension] = value === state[dimension] ? '' : value;
    apply();
  };

  for (const button of buttons) {
    button.addEventListener('click', () => {
      const dimension = button.dataset.filter as Dimension | undefined;
      if (!dimension) return;
      setFilter(dimension, button.dataset.value ?? '');
    });
  }

  for (const reset of resets) {
    reset.addEventListener('click', () => {
      for (const dimension of DIMENSIONS) state[dimension] = '';
      apply();
    });
  }

  // Back/forward inside the explorer keeps the filters aligned with the URL.
  window.addEventListener('popstate', () => {
    readUrl();
    apply();
  });

  readUrl();
  apply();
}

export {};
