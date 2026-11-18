/**
 * Client-side enhancement for the Toolchain section.
 * Handles interactive filtering by bundle, proficiency level, evidence, and search grep,
 * as well as switching between the Manifest view and the Process/Evidence view.
 * Fully progressively enhanced: all content is server-rendered and visible without JS.
 */

export function initToolchain(): void {
  const root = document.querySelector<HTMLElement>('[data-toolchain]');
  if (!root) return;

  const searchInput = root.querySelector<HTMLInputElement>('[data-tc-search]');
  const filterButtons = root.querySelectorAll<HTMLButtonElement>('[data-tc-filter]');
  const levelButtons = root.querySelectorAll<HTMLButtonElement>('[data-tc-level]');
  const evidenceBtn = root.querySelector<HTMLButtonElement>('[data-tc-evidence]');
  const viewButtons = root.querySelectorAll<HTMLButtonElement>('[data-tc-view]');
  const resetButton = root.querySelector<HTMLButtonElement>('[data-tc-reset]');
  const countBadge = root.querySelector<HTMLElement>('[data-tc-count]');
  const liveStatus = root.querySelector<HTMLElement>('#tc-status');
  const emptyMessage = root.querySelector<HTMLElement>('[data-tc-empty]');

  const manifestView = root.querySelector<HTMLElement>('[data-tc-manifest-view]');
  const processView = root.querySelector<HTMLElement>('[data-tc-process-view]');

  const allItems = root.querySelectorAll<HTMLElement>('[data-tc-item]');
  const allGroups = root.querySelectorAll<HTMLElement>('[data-tc-group]');

  let activeGroup = '';
  let activeLevel = '';
  let evidenceOnly = false;
  let searchQuery = '';
  let activeView: 'manifest' | 'process' = 'manifest';

  // Restore stored view if present
  try {
    const savedView = sessionStorage.getItem('av-toolchain-view');
    if (savedView === 'manifest' || savedView === 'process') {
      activeView = savedView;
    }
  } catch {
    // sessionStorage unavailable
  }

  function applyView(view: 'manifest' | 'process') {
    activeView = view;
    try {
      sessionStorage.setItem('av-toolchain-view', view);
    } catch {
      // ignore
    }

    viewButtons.forEach((btn) => {
      const isMatch = btn.dataset.tcView === view;
      btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      btn.classList.toggle('active', isMatch);
    });

    if (manifestView) manifestView.hidden = view !== 'manifest';
    if (processView) processView.hidden = view !== 'process';
  }

  function applyFilters() {
    let visibleCount = 0;
    const queryTokens = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);

    allItems.forEach((item) => {
      const itemGroup = item.dataset.group ?? '';
      const itemLevel = item.dataset.level ?? '';
      const hasEvidence = item.dataset.hasEvidence === 'true';
      const searchText = item.dataset.search ?? '';

      const matchGroup = !activeGroup || itemGroup === activeGroup;
      const matchLevel = !activeLevel || itemLevel === activeLevel;
      const matchEvidence = !evidenceOnly || hasEvidence;
      const matchQuery =
        queryTokens.length === 0 ||
        queryTokens.every((token) => searchText.includes(token));

      const isVisible = matchGroup && matchLevel && matchEvidence && matchQuery;
      item.hidden = !isVisible;
      if (isVisible) visibleCount++;
    });

    // Toggle group containers based on whether any children are visible
    allGroups.forEach((grp) => {
      const itemsInGroup = grp.querySelectorAll<HTMLElement>('[data-tc-item]:not([hidden])');
      grp.hidden = itemsInGroup.length === 0;
    });

    // Update count badge & live announcement
    const totalCount = allItems.length / 2; // accounted for both views
    const adjustedVisible = visibleCount / 2;

    if (countBadge) {
      countBadge.textContent = `${adjustedVisible} packages`;
    }

    if (emptyMessage) {
      emptyMessage.hidden = adjustedVisible > 0;
    }

    if (liveStatus) {
      liveStatus.textContent = `Showing ${adjustedVisible} of ${totalCount} packages.`;
    }
  }

  // Event handlers: Group filters
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.tcFilter ?? '';
      activeGroup = activeGroup === value ? '' : value;

      filterButtons.forEach((b) => {
        const selected = (b.dataset.tcFilter ?? '') === activeGroup;
        b.setAttribute('aria-pressed', selected ? 'true' : 'false');
        b.classList.toggle('active', selected);
      });

      applyFilters();
    });
  });

  // Event handlers: Level filters
  levelButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.tcLevel ?? '';
      activeLevel = activeLevel === value ? '' : value;

      levelButtons.forEach((b) => {
        const selected = (b.dataset.tcLevel ?? '') === activeLevel;
        b.setAttribute('aria-pressed', selected ? 'true' : 'false');
        b.classList.toggle('active', selected);
      });

      applyFilters();
    });
  });

  // Event handler: Evidence toggle
  if (evidenceBtn) {
    evidenceBtn.addEventListener('click', () => {
      evidenceOnly = !evidenceOnly;
      evidenceBtn.setAttribute('aria-pressed', evidenceOnly ? 'true' : 'false');
      evidenceBtn.classList.toggle('active', evidenceOnly);
      applyFilters();
    });
  }

  // Event handlers: View switcher
  viewButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = (btn.dataset.tcView as 'manifest' | 'process') || 'manifest';
      applyView(view);
    });
  });

  // Event handler: Search grep
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value;
      applyFilters();
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        searchQuery = '';
        applyFilters();
      }
    });
  }

  // Reset button
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      activeGroup = '';
      activeLevel = '';
      evidenceOnly = false;
      searchQuery = '';

      if (searchInput) searchInput.value = '';

      filterButtons.forEach((b) => {
        const isAll = (b.dataset.tcFilter ?? '') === '';
        b.setAttribute('aria-pressed', isAll ? 'true' : 'false');
        b.classList.toggle('active', isAll);
      });

      levelButtons.forEach((b) => {
        const isAll = (b.dataset.tcLevel ?? '') === '';
        b.setAttribute('aria-pressed', isAll ? 'true' : 'false');
        b.classList.toggle('active', isAll);
      });

      if (evidenceBtn) {
        evidenceBtn.setAttribute('aria-pressed', 'false');
        evidenceBtn.classList.remove('active');
      }

      applyFilters();
    });
  }

  // Initial state
  applyView(activeView);
  applyFilters();
}

// Auto-init on script load
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initToolchain());
  } else {
    initToolchain();
  }
}
