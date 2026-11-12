// Reading progress for long-form pages. The bar is decorative, so this only
// updates a transform; no layout work, no scroll position changes.
const bar = document.getElementById('readingProgressBar');
if (bar) {
  let frame = 0;

  const update = () => {
    frame = 0;
    const root = document.documentElement;
    const max = root.scrollHeight - root.clientHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, root.scrollTop / max)) : 0;
    bar.style.transform = `scaleX(${ratio.toFixed(4)})`;
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  update();
}
