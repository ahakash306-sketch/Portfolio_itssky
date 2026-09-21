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
    if (event.key === 'Escape' && !document.body.classList.contains('portfolio-chat-open')) setMenu(false, true);
  });
  mobileMenu.addEventListener('change', () => setMenu(false));

  const chatLayer = document.getElementById('portfolio-chat-layer');
  const chatBackground = [...document.body.children].filter(el => el !== chatLayer && !['SCRIPT','STYLE'].includes(el.tagName));
  const chatFrame = chatLayer && chatLayer.querySelector('.portfolio-chat-frame');
  const chatClose = chatLayer && chatLayer.querySelector('.portfolio-chat-close');
  const chatTriggers = [...document.querySelectorAll('.conversation-return, .mobile-conversation-return')];
  let chatReturnFocus = null;
  let chatHideTimer = 0;
  let chatScrollY = 0;

  const closeChat = () => {
    if (!chatLayer || chatLayer.hidden) return;
    chatLayer.dataset.open = 'false';
    document.body.classList.remove('portfolio-chat-open');
    document.documentElement.classList.remove('portfolio-chat-open');
    chatBackground.forEach(el => { el.inert = false; });
    clearTimeout(chatHideTimer);
    chatHideTimer = window.setTimeout(() => {
      chatLayer.hidden = true;
      window.scrollTo(0, chatScrollY);
      if (chatReturnFocus && document.contains(chatReturnFocus)) chatReturnFocus.focus({ preventScroll: true });
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 360);
  };

  const openChat = trigger => {
    if (!chatLayer || !chatFrame) return;
    clearTimeout(chatHideTimer);
    chatReturnFocus = trigger || document.activeElement;
    chatScrollY = window.scrollY;
    if (!chatFrame.src) chatFrame.src = chatFrame.dataset.src;
    chatLayer.hidden = false;
    document.body.classList.add('portfolio-chat-open');
    document.documentElement.classList.add('portfolio-chat-open');
    chatBackground.forEach(el => { el.inert = true; });
    requestAnimationFrame(() => {
      chatLayer.dataset.open = 'true';
      chatClose.focus({ preventScroll: true });
      window.scrollTo(0, chatScrollY);
    });
    requestAnimationFrame(() => window.scrollTo(0, chatScrollY));
    window.setTimeout(() => window.scrollTo(0, chatScrollY), 80);
    setMenu(false);
  };

  chatTriggers.forEach(trigger => { trigger.setAttribute('aria-haspopup', 'dialog'); });
  document.addEventListener('click', event => {
    const trigger = event.target.closest && event.target.closest('.conversation-return, .mobile-conversation-return');
    if (!trigger) return;
    event.preventDefault();
    openChat(trigger);
  }, true);
  document.addEventListener('pointerdown', event => {
    const trigger = event.target.closest && event.target.closest('.conversation-return, .mobile-conversation-return');
    if (!trigger) return;
    chatScrollY = window.scrollY;
    event.preventDefault();
  }, true);
  if (chatFrame) chatFrame.addEventListener('load', () => window.scrollTo(0, chatScrollY));
  if (chatLayer) chatLayer.addEventListener('click', event => {
    if (event.target.closest('.portfolio-chat-close, .portfolio-chat-backdrop')) closeChat();
  });
  document.addEventListener('keydown', event => {
    if (!chatLayer || chatLayer.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeChat();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [chatClose, chatFrame].filter(Boolean);
    const current = focusable.indexOf(document.activeElement);
    if (event.shiftKey && current <= 0) {
      event.preventDefault();
      focusable.at(-1).focus();
    } else if (!event.shiftKey && current === focusable.length - 1) {
      event.preventDefault();
      focusable[0].focus();
    }
  });
  window.addEventListener('message', event => {
    if (event.source === chatFrame?.contentWindow && event.data?.type === 'portfolio-chat-close') closeChat();
  });

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
