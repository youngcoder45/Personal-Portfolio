// Project detail pages point their "projects" links at the last filtered
// explorer view, if the visitor arrived from one.
const STORE_KEY = 'av-projects-filter';
const backLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-projects-back]'));
if (backLinks.length) {
  try {
    const stored = sessionStorage.getItem(STORE_KEY);
    if (stored) {
      for (const link of backLinks) {
        link.href = `/projects/?${stored}`;
        link.dataset.filtered = '1';
        link.title = 'back to the filtered project list';
      }
    }
  } catch {
    /* private mode */
  }
}

export {};
