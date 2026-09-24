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

  const siteHeader = document.querySelector('.shell > header');
  let previousScrollY = window.scrollY;
  const syncHeaderScrollState = () => {
    if (!siteHeader) return;
    const currentY = window.scrollY;
    siteHeader.dataset.scrolled = currentY > Math.max(80, window.innerHeight * .42) ? 'true' : 'false';
    const goingDown = currentY > previousScrollY + 3;
    const goingUp = currentY < previousScrollY - 3;
    siteHeader.dataset.hidden = goingDown ? 'true' : (goingUp ? 'false' : siteHeader.dataset.hidden || 'false');
    siteHeader.dataset.floating = goingUp && currentY > 20 ? 'true' : 'false';
    previousScrollY = currentY;
  };
  syncHeaderScrollState();
  window.addEventListener('scroll', syncHeaderScrollState, { passive: true });

  const chatLayer = document.getElementById('portfolio-chat-layer');
  const chatBackground = [...document.body.children].filter(el => el !== chatLayer && !['SCRIPT','STYLE'].includes(el.tagName));
  const chatFrame = chatLayer && chatLayer.querySelector('.portfolio-chat-frame');
  const chatClose = chatLayer && chatLayer.querySelector('.portfolio-chat-close');
  const chatTriggers = [...document.querySelectorAll('.conversation-return, .mobile-conversation-return')];
  const askDock = document.getElementById('portfolio-ask-dock');
  const askForm = document.getElementById('portfolio-ask-form');
  const askInput = document.getElementById('portfolio-ask-input');
  const askSuggestions = document.getElementById('portfolio-ask-suggestions');
  let chatReturnFocus = null;
  let chatHideTimer = 0;
  let chatScrollY = 0;
  let pendingChatQuestion = '';

  const sendChatQuestion = question => {
    if (!question || !chatFrame?.contentWindow) return;
    chatFrame.contentWindow.postMessage({ type: 'portfolio-chat-question', question }, location.protocol === 'file:' ? '*' : location.origin);
  };

  const closeAskSuggestions = () => {
    if (!askDock || !askSuggestions || !askInput) return;
    askDock.dataset.open = 'false';
    askSuggestions.hidden = true;
    askInput.setAttribute('aria-expanded', 'false');
  };

  const openAskSuggestions = () => {
    if (!askDock || !askSuggestions || !askInput) return;
    if (chatLayer && !chatLayer.hidden && chatLayer.dataset.open === 'true') return;
    askDock.dataset.expanded = 'true';
    askDock.dataset.open = 'true';
    askSuggestions.hidden = false;
    askInput.setAttribute('aria-expanded', 'true');
  };

  const closeChat = () => {
    if (!chatLayer || chatLayer.hidden) return;
    chatLayer.dataset.open = 'false';
    if (askDock) {
      askDock.dataset.chatOpen = 'false';
      askDock.dataset.expanded = 'false';
    }
  document.body.classList.remove('portfolio-chat-open');
  document.documentElement.classList.remove('portfolio-chat-open');
  chatBackground.forEach(el => { el.inert = false; });
    clearTimeout(chatHideTimer);
    chatHideTimer = window.setTimeout(() => {
      chatLayer.hidden = true;
      window.scrollTo(0, chatScrollY);
      if (chatReturnFocus && document.contains(chatReturnFocus) && typeof chatReturnFocus.focus === 'function') chatReturnFocus.focus({ preventScroll: true });
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 360);
  };

  const openChat = (trigger, question = '') => {
    if (!chatLayer || !chatFrame) return;
    clearTimeout(chatHideTimer);
    closeAskSuggestions();
    if (askDock) {
      askDock.dataset.chatOpen = 'true';
      askDock.dataset.expanded = 'true';
    }
    chatReturnFocus = trigger || document.activeElement;
    chatScrollY = window.scrollY;
    pendingChatQuestion = question;
    if (!chatFrame.src) {
      const source = new URL(chatFrame.dataset.src, location.href);
      if (question) {
        source.searchParams.set('question', question);
        pendingChatQuestion = '';
      }
      chatFrame.src = source.href;
    }
    chatLayer.hidden = false;
  document.body.classList.remove('portfolio-chat-open');
  document.documentElement.classList.remove('portfolio-chat-open');
  chatBackground.forEach(el => { el.inert = false; });
    requestAnimationFrame(() => {
      chatLayer.dataset.open = 'true';
      if (chatClose) chatClose.focus({ preventScroll: true });
      if (pendingChatQuestion && chatFrame.src) {
        sendChatQuestion(pendingChatQuestion);
        pendingChatQuestion = '';
      }
      window.scrollTo(0, chatScrollY);
    });
    requestAnimationFrame(() => window.scrollTo(0, chatScrollY));
    window.setTimeout(() => window.scrollTo(0, chatScrollY), 80);
    setMenu(false);
  };
  window.openPortfolioChat = trigger => openChat(trigger);

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
  }, true);
  if (chatFrame) chatFrame.addEventListener('load', () => {
    window.scrollTo(0, chatScrollY);
    if (pendingChatQuestion) {
      sendChatQuestion(pendingChatQuestion);
      pendingChatQuestion = '';
    }
  });
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

  if (askForm && askInput && askSuggestions) {
    askForm.addEventListener('click', openAskSuggestions);
    askForm.addEventListener('submit', event => {
      event.preventDefault();
      const question = askInput.value.trim();
      if (!question) {
        openAskSuggestions();
        return;
      }
      closeAskSuggestions();
      openChat(askDock, question);
      askInput.value = '';
    });
    askSuggestions.addEventListener('click', event => {
      const button = event.target.closest('[data-ask-question]');
      if (!button) return;
      const question = button.dataset.askQuestion || '';
      closeAskSuggestions();
      openChat(askDock, question);
    });
    document.addEventListener('pointerdown', event => {
      if (!event.target.closest('#portfolio-ask-dock')) {
        closeAskSuggestions();
        if (!chatLayer || chatLayer.hidden || chatLayer.dataset.open !== 'true') askDock.dataset.expanded = 'false';
      }
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && askDock?.dataset.open === 'true') {
        closeAskSuggestions();
        if (!chatLayer || chatLayer.hidden || chatLayer.dataset.open !== 'true') askDock.dataset.expanded = 'false';
        askInput.blur();
      }
    });
  }

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
