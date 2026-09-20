(() => {
  'use strict';
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

  const mobileMenu = matchMedia('(max-width: 600px)');
  const setMenu = (open, returnFocus = false) => {
    const header = document.querySelector('.shell > header');
    const toggle = header && header.querySelector('.mobile-nav-toggle');
    if (!header || !toggle) return;
    const next = Boolean(open && mobileMenu.matches);
    header.dataset.navOpen = String(next);
    toggle.setAttribute('aria-expanded', String(next));
    toggle.setAttribute('aria-label', next ? 'Close menu' : 'Open menu');
    if (returnFocus) toggle.focus();
  };
  document.addEventListener('click', event => {
    const toggle = event.target.closest && event.target.closest('.mobile-nav-toggle');
    if (toggle) {
      const header = toggle.closest('header');
      setMenu(header.dataset.navOpen !== 'true');
      return;
    }
    const menuLink = event.target.closest && event.target.closest('.primary-navigation a');
    if (menuLink || (mobileMenu.matches && !event.target.closest('.shell > header'))) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMenu(false, true);
  });
  mobileMenu.addEventListener('change', () => setMenu(false));

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
