(() => {
  'use strict';
  let pending = false;
  const update = () => {
    pending = false;
    const header = document.querySelector('.shell > header');
    if (!header) return;
    const offset = header.getBoundingClientRect().height + 16;
    document.documentElement.style.setProperty('--sky-header-height', `${offset}px`);
    const links = [...header.querySelectorAll('a[href^="#"]')];
    let active = null;
    for (const link of links) {
      const section = document.getElementById(link.hash.slice(1));
      if (section && section.getBoundingClientRect().top <= offset + 80) active = link;
    }
    if (window.scrollY + innerHeight >= document.documentElement.scrollHeight - 8) {
      active = links.find(link => link.hash === '#contact') || active;
    }
    for (const link of links) {
      if (link === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
  const schedule = () => {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  schedule();
})();
