// Section tracking for the homepage rail, mobile index, and top-bar anchors.
// Uses a narrow centre band so the active section matches what is being read,
// not merely what happens to touch the viewport.
const links = Array.from(
  document.querySelectorAll<HTMLAnchorElement>('[data-section-link]'),
);
if (links.length) {
  const ids = Array.from(
    new Set(
      links
        .map((link) => link.dataset.sectionLink)
        .filter((id): id is string => Boolean(id)),
    ),
  );
  const targets = ids
    .map((id) => document.getElementById(id))
    .filter((element): element is HTMLElement => Boolean(element));

  let active = '';
  let frame = 0;

  const setActive = (id: string) => {
    if (!id || id === active) return;
    active = id;
    document.documentElement.dataset.activeSection = id;

    for (const link of links) {
      if (link.dataset.sectionLink === id) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    }

    for (const anchor of document.querySelectorAll<HTMLAnchorElement>('[data-nav-anchor]')) {
      if (anchor.dataset.navAnchor === id) {
        anchor.setAttribute('aria-current', 'location');
      } else {
        anchor.removeAttribute('aria-current');
      }
    }
  };

  const pickFrom = (visible: Set<string>) => {
    if (!visible.size) return active;
    const band = window.innerHeight * 0.4;
    const candidates = Array.from(visible)
      .map((id) => ({ id, top: document.getElementById(id)?.getBoundingClientRect().top ?? 0 }))
      .sort((a, b) => a.top - b.top);
    const above = candidates.filter((candidate) => candidate.top <= band + 1);
    return (above.length ? above[above.length - 1] : candidates[0]).id;
  };

  const supportsObserver = 'IntersectionObserver' in window;

  if (supportsObserver) {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        setActive(pickFrom(visible));
      },
      // A 5%-tall band around the 40% line of the viewport.
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );

    for (const target of targets) observer.observe(target);

    // Short final sections can pass above the band before the page bottom.
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const atBottom =
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 2;
        if (atBottom && targets.length) setActive(targets[targets.length - 1].id);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  } else {
    // Graceful fallback for browsers without IntersectionObserver.
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const band = window.innerHeight * 0.4;
        let current = targets[0]?.id ?? '';
        for (const target of targets) {
          if (target.getBoundingClientRect().top <= band) current = target.id;
        }
        if (
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 2
        ) {
          current = targets[targets.length - 1]?.id ?? current;
        }
        setActive(current);
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  if (targets.length) setActive(targets[0].id);

  // Reflect the destination immediately on click, even before scrolling settles.
  document.addEventListener('click', (event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('[data-section-link]');
    const id = link?.dataset.sectionLink;
    if (id) setActive(id);
  });

  if (window.location.hash) {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (ids.includes(id)) setActive(id);
  }
}
