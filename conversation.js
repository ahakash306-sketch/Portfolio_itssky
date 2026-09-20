(() => {
  'use strict';

  const KB = window.PORTFOLIO_KNOWLEDGE;
  if (!KB) return;

  const $ = selector => document.querySelector(selector);
  const conversation = $('#conversation');
  const welcome = $('#welcome');
  const form = $('#ask');
  const input = $('#question');
  const dock = $('#question-dock');
  const reset = $('#reset');
  const announcement = $('#announcement');
  const topicMap = new Map(KB.topics.map(topic => [topic.id, topic]));
  const evidenceTopics = new Set([
    'best_work', 'products', 'projects', 'clients', 'impact', 'process',
    'research', 'data', 'measuring_success', 'industries', 'case_studies'
  ]);

  const make = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined && text !== null) node.textContent = text;
    if (className) node.className = className;
    return node;
  };

  const normalize = value => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const tokens = value => normalize(value).split(' ').filter(word => word.length > 1);

  function editDistance(a, b) {
    if (Math.abs(a.length - b.length) > 1) return 2;
    const row = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let i = 1; i <= a.length; i += 1) {
      let previous = row[0];
      row[0] = i;
      for (let j = 1; j <= b.length; j += 1) {
        const current = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (a[i - 1] === b[j - 1] ? 0 : 1));
        previous = current;
      }
    }
    return row[b.length];
  }

  function scoreTopic(topic, query) {
    const clean = normalize(query);
    const queryTokens = tokens(clean);
    const phrases = [topic.question, ...(topic.variations || []), ...(topic.keywords || [])].map(normalize).filter(Boolean);
    let score = 0;

    phrases.forEach(phrase => {
      if (clean === phrase) score = Math.max(score, 100);
      else if (clean.includes(phrase) || phrase.includes(clean)) score = Math.max(score, 28 + Math.min(phrase.length, clean.length) / 5);

      const phraseTokens = tokens(phrase);
      let overlap = 0;
      queryTokens.forEach(word => {
        if (phraseTokens.includes(word)) overlap += word.length >= 5 ? 4 : 2;
        else if (word.length >= 4 && phraseTokens.some(candidate => candidate.length >= 4 && (candidate.includes(word) || word.includes(candidate)))) overlap += 2.5;
        else if (word.length >= 5 && phraseTokens.some(candidate => candidate.length >= 5 && editDistance(word, candidate) <= 1)) overlap += 2.25;
      });
      score = Math.max(score, overlap);
    });
    return score + (topic.primary ? 0.2 : 0);
  }

  function rankedTopics(query) {
    return KB.topics
      .map(topic => ({ topic, score: scoreTopic(topic, query) }))
      .sort((a, b) => b.score - a.score);
  }

  function detectTopic(query) {
    const ranked = rankedTopics(query);
    return ranked[0] && ranked[0].score >= 4.25 ? ranked[0].topic : null;
  }

  function withPreview(href) {
    if (!new URLSearchParams(location.search).has('preview') || /^(mailto:|https?:)/.test(href)) return href;
    return `${href}${href.includes('?') ? '&' : '?'}preview=1`;
  }

  function projectHref(id) {
    const href = window.CMS && typeof window.CMS.pageFor === 'function' ? window.CMS.pageFor(id) : `works/${id}.html`;
    return withPreview(href);
  }

  function messageComponent(text) {
    const asked = make('div', null, 'question');
    asked.append(make('span', text));
    return asked;
  }

  function chipComponent(topic, label) {
    const button = make('button', `${label || topic.shortLabel || topic.question} →`);
    button.type = 'button';
    button.dataset.topic = topic.id;
    return button;
  }

  function projectLinkComponent(link) {
    if (link.project && KB.projects[link.project]) {
      const project = KB.projects[link.project];
      const anchor = make('a', null, 'project evidence-card');
      anchor.href = projectHref(link.project);
      const image = make('img');
      image.src = project.image;
      image.alt = '';
      image.loading = 'lazy';
      anchor.append(
        image,
        make('p', project.tag, 'tag'),
        make('h3', project.title || project.name),
        make('p', link.evidence || project.proof || project.short),
        make('span', `${link.label || 'View case study'} ↗`, 'open')
      );
      return anchor;
    } else {
      const anchor = make('a', null, 'evidence-item');
      anchor.href = withPreview(link.href || 'explore.html#work');
      anchor.append(
        make('span', link.label || 'View evidence', 'evidence-name'),
        make('span', 'Open supporting portfolio content', 'evidence-claim'),
        make('span', 'Open ↗', 'evidence-link')
      );
      return anchor;
    }
  }

  function shouldShowEvidence(topic) {
    if (evidenceTopics.has(topic.id)) return true;
    return Object.keys(KB.projects).some(id => topic.id === id || topic.id.startsWith(`${id}_`));
  }

  function answerComponent(topic, suggestedTopics) {
    const answer = make('div', null, 'answer');
    answer.tabIndex = -1;
    answer.append(make('h2', topic.question), make('p', topic.answer, 'short-answer'));

    if (topic.details && topic.details.length) {
      const details = make('ul', null, 'answer-details');
      topic.details.forEach(item => details.append(make('li', item)));
      answer.append(details);
    }

    const showEvidence = shouldShowEvidence(topic);
    if (showEvidence && topic.links && topic.links.length) {
      const evidence = make('div', null, 'evidence');
      evidence.append(make('p', 'Evidence', 'response-label'));
      const list = make('div', null, 'evidence-list');
      if (topic.links.some(link => link.project)) list.classList.add('cards');
      topic.links.forEach(link => list.append(projectLinkComponent(link)));
      evidence.append(list);
      answer.append(evidence);
    }

    const followUpIds = suggestedTopics || topic.followUps || [];
    const validFollowUps = followUpIds.map(id => typeof id === 'string' ? topicMap.get(id) : id).filter(Boolean).slice(0, 4);
    if (validFollowUps.length) {
      const section = make('div', null, 'followup-section');
      section.append(make('p', 'Go deeper', 'response-label'));
      const list = make('div', null, 'followups');
      validFollowUps.forEach(item => list.append(chipComponent(item)));
      const linkedProject = showEvidence && (topic.links || []).find(link => link.project);
      if (linkedProject) {
        const full = make('a', 'View the whole case study ↗', 'full-case');
        full.href = projectHref(linkedProject.project);
        list.append(full);
      }
      section.append(list);
      answer.append(section);
    }
    return answer;
  }

  function shouldScroll(node) {
    const rect = node.getBoundingClientRect();
    const dockHeight = dock.getBoundingClientRect().height || 0;
    return rect.bottom > window.innerHeight - dockHeight - 16;
  }

  function updateDockHeight() {
    if (!document.body.classList.contains('started')) return;
    document.documentElement.style.setProperty('--dock-height', `${Math.ceil(dock.getBoundingClientRect().height)}px`);
  }

  function startConversation() {
    if (!document.body.classList.contains('started')) {
      document.body.classList.add('started');
      welcome.hidden = true;
      conversation.hidden = false;
      updateDockHeight();
    }
  }

  function addTurn(question, topic, suggestedTopics) {
    startConversation();
    const turn = make('section', null, 'turn');
    turn.append(messageComponent(question), answerComponent(topic, suggestedTopics));
    conversation.append(turn);
    announcement.textContent = `Answered: ${question}`;
    requestAnimationFrame(() => {
      const answer = turn.querySelector('.answer');
      if (shouldScroll(turn)) answer.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  }

  function askTopic(id, displayedQuestion) {
    const topic = topicMap.get(id);
    if (!topic) return;
    addTurn(displayedQuestion || topic.question, topic);
    input.value = '';
  }

  function askText(question) {
    const topic = detectTopic(question);
    if (topic) {
      addTurn(question, topic);
      return;
    }
    const nearest = rankedTopics(question).map(item => item.topic).slice(0, 3);
    addTurn(question, {
      id: 'fallback',
      question: 'I’m not sure about that one yet.',
      answer: "I don't have a good answer for that here yet. Maybe one of these is what you're looking for?",
      links: [],
      followUps: []
    }, nearest);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-topic]');
    if (!button) return;
    const topic = topicMap.get(button.dataset.topic);
    if (!topic) return;
    const displayedQuestion = button.closest('.suggestions') ? topic.question : button.textContent.replace(/\s*→\s*$/, '');
    askTopic(topic.id, displayedQuestion);
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    askText(question);
    input.value = '';
    input.focus();
  });

  reset.addEventListener('click', () => {
    conversation.replaceChildren();
    conversation.hidden = true;
    welcome.hidden = false;
    document.body.classList.remove('started');
    document.documentElement.style.removeProperty('--dock-height');
    input.value = '';
    announcement.textContent = 'Started a new conversation.';
    input.focus();
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });

  const themeToggle = $('#theme-toggle');
  function setTheme(theme, persist) {
    document.documentElement.dataset.theme = theme;
    const light = theme === 'light';
    themeToggle.setAttribute('aria-pressed', String(light));
    themeToggle.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`);
    themeToggle.querySelector('[aria-hidden]').textContent = light ? '☾' : '☼';
    const themeLabel = themeToggle.querySelector('.theme-label');
    if (themeLabel) themeLabel.textContent = light ? 'Dark' : 'Light';
    if (persist) {
      try { localStorage.setItem('akash.theme', theme); } catch (error) { /* Storage is optional. */ }
    }
  }
  setTheme(document.documentElement.dataset.theme || 'dark', false);
  themeToggle.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true));

  if ('ResizeObserver' in window) new ResizeObserver(updateDockHeight).observe(dock);
  window.addEventListener('resize', updateDockHeight, { passive: true });

  if (window.CMS) {
    const applyCmsContent = () => {
      window.CMS.setPage('home');
      window.CMS.applyText(document);
      window.CMS.applySeo('home');
    };
    applyCmsContent();
    window.CMS.onChange(applyCmsContent);
    window.CMS.startTracking();
  }

  if (new URLSearchParams(location.search).has('preview')) {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !/^(mailto:|https?:)/.test(href)) link.href = withPreview(href);
    });
  }
})();
