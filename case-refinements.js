(() => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) {
    scrollTo(0, 0);
    addEventListener('load', () => scrollTo(0, 0), { once: true });
  }

  const warmed = new Set();
  const warm = event => {
    const anchor = event.target.closest && event.target.closest('a[href]');
    if (!anchor) return;
    const url = new URL(anchor.href, document.baseURI);
    if (url.origin !== location.origin || url.href === location.href || warmed.has(url.href)) return;
    warmed.add(url.href);
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'document';
    link.href = url.href;
    document.head.append(link);
  };
  document.addEventListener('pointerover', warm, { passive: true });
  document.addEventListener('focusin', warm);
  document.addEventListener('touchstart', warm, { passive: true });

  let queued = false;
  function update() {
    queued = false;
    const root = document.querySelector('[data-case-theme]');
    if (!root) return;
    const distance = document.documentElement.scrollHeight - innerHeight;
    root.style.setProperty('--case-progress', distance > 0 ? Math.min(1,Math.max(0,scrollY / distance)) : 0);
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  addEventListener('load',schedule);
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  schedule();
})();
