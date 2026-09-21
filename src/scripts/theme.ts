const KEY = 'av-theme';
const root = document.documentElement;

function current(): 'dark' | 'paper' {
  return root.dataset.theme === 'paper' ? 'paper' : 'dark';
}

function sync(t: 'dark' | 'paper') {
  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.setAttribute('aria-pressed', String(t === 'paper'));
    btn.innerHTML = t === 'dark' ? '&#9790; light' : '&#9788; dark';
  }
  try {
    localStorage.setItem(KEY, t);
  } catch {
    /* private mode */
  }
}

function init() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = current() === 'paper' ? 'dark' : 'paper';
    root.dataset.theme = next;
    sync(next);
  });
  sync(current());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}