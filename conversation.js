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
  const toolMap = new Map((KB.tools || []).map(tool => [tool.id, tool]));
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
    .replace(/[’']/g, '')
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

  function basicIntentTopic(query) {
    const clean = normalize(query);
    const intent = (KB.basicIntents || []).find(item => (item.phrases || []).some(phrase => normalize(phrase) === clean));
    if (!intent) return null;
    return {
      id: `conversation_${intent.id}`,
      question: intent.question,
      answer: intent.answer,
      links: [],
      followUps: intent.followUps || [],
      followUpLimit: (intent.followUps || []).length
    };
  }

  function displayUrl(value) {
    return String(value || '').replace(/^https?:\/\/(?:www\.)?/, '').replace(/\/$/, '');
  }

  function profileTemplate(text) {
    const profile = KB.profile || {};
    const values = Object.assign({}, profile, {
      websiteDisplay: displayUrl(profile.website),
      linkedinDisplay: displayUrl(profile.linkedin),
      behanceDisplay: displayUrl(profile.behance)
    });
    return String(text || '').replace(/\{([a-zA-Z]+)\}/g, (_, key) => values[key] || '');
  }

  function configuredIntentTopic(intent) {
    return {
      id: intent.id,
      question: intent.question,
      answer: profileTemplate(intent.answer),
      contactCard: intent.cardFields ? { title: intent.cardTitle, fields: intent.cardFields } : null,
      contactActions: intent.actions || [],
      links: [],
      followUps: intent.followUps || []
    };
  }

  function matchesIntentPhrase(query, phrase) {
    const clean = normalize(query);
    const target = normalize(phrase);
    if (!target) return false;
    if (clean === target) return true;
    if (target.split(' ').length === 1) return (` ${clean} `).includes(` ${target} `);
    return clean.includes(target);
  }

  function configuredIntent(query, intents) {
    const match = (intents || []).find(intent => (intent.phrases || []).some(phrase => matchesIntentPhrase(query, phrase)));
    return match ? configuredIntentTopic(match) : null;
  }

  function aliasInQuery(query, alias) {
    const clean = ` ${normalize(query)} `;
    return clean.includes(` ${normalize(alias)} `);
  }

  function isToolQuestion(query) {
    const clean = normalize(query);
    return /^(do|did|can|have|are) you\b/.test(clean) ||
      /\b(know|use|used|worked with|experience with|experience in)\b/.test(clean) ||
      /^what do you use\b/.test(clean) || /^how do you use\b/.test(clean);
  }

  function knownToolTopic(query) {
    const clean = normalize(query);
    if (!isToolQuestion(clean) && !(KB.tools || []).some(tool => (tool.aliases || []).some(alias => normalize(alias) === clean))) return null;

    let match = null;
    let matchedLength = -1;
    (KB.tools || []).forEach(tool => {
      (tool.aliases || []).forEach(alias => {
        const normalizedAlias = normalize(alias);
        if (aliasInQuery(clean, normalizedAlias) && normalizedAlias.length > matchedLength) {
          match = tool;
          matchedLength = normalizedAlias.length;
        }
      });
    });
    return match ? toolTopic(match) : null;
  }

  function toolTopic(tool) {
    return {
      id: `tool_${tool.id}`,
      question: `Do you use ${tool.name}?`,
      answer: tool.answer,
      links: [],
      followUps: ['tools', 'skills', 'design_systems']
    };
  }

  function unknownToolTopic(query) {
    const clean = normalize(query);
    const patterns = [
      /^(?:do|did) you (?:know|use) (.+)$/,
      /^have you (?:used|worked with) (.+)$/,
      /^can you use (.+)$/,
      /^what do you use (.+) for$/,
      /^do you have experience (?:with|in) (.+)$/
    ];
    const result = patterns.map(pattern => clean.match(pattern)).find(Boolean);
    if (!result) return null;
    const candidate = result[1].replace(/^(?:a|an|the)\s+/, '').trim();
    const generic = new Set(['tools', 'software', 'design', 'product design', 'ux', 'user research', 'research', 'analytics', 'data']);
    if (!candidate || candidate.split(' ').length > 5 || generic.has(candidate)) return null;
    return {
      id: 'unknown_tool',
      question: `Is ${candidate} in your toolkit?`,
      answer: 'That’s not currently listed in my toolkit. Want to see what I do use?',
      links: [],
      followUps: ['tools', 'skills']
    };
  }

  function detectTopic(query) {
    const basic = basicIntentTopic(query);
    if (basic) return basic;
    const contact = configuredIntent(query, KB.contactIntents);
    if (contact) return contact;
    const hiring = configuredIntent(query, KB.hiringIntents);
    if (hiring) return hiring;
    const tool = knownToolTopic(query);
    if (tool) return tool;
    const unknownTool = unknownToolTopic(query);
    if (unknownTool) return unknownTool;
    const ranked = rankedTopics(query);
    return ranked[0] && ranked[0].score >= 4.25 ? ranked[0].topic : null;
  }

  function withPreview(href) {
    if (!new URLSearchParams(location.search).has('preview') || /^(mailto:|https?:)/.test(href)) return href;
    return `${href}${href.includes('?') ? '&' : '?'}preview=1`;
  }

  const warmedHrefs = new Set();
  function warmHref(href) {
    if (!href) return;
    const url = new URL(href, document.baseURI);
    if (url.origin !== location.origin || url.href === location.href || warmedHrefs.has(url.href)) return;
    warmedHrefs.add(url.href);
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'document';
    link.href = url.href;
    document.head.append(link);
  }

  function warmLinkedPage(event) {
    const anchor = event.target.closest && event.target.closest('a[href]');
    if (anchor) warmHref(anchor.href);
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

  function catalogComponent(catalog) {
    const catalogNode = make('div', null, 'answer-catalog');
    catalog.forEach(section => {
      const sectionNode = make('section', null, 'catalog-section');
      sectionNode.append(make('h3', section.label));
      const grid = make('div', null, 'catalog-grid');
      (section.groups || []).forEach(group => {
        const groupNode = make('div', null, 'catalog-group');
        groupNode.append(make('h4', group.heading));
        const list = make('ul');
        (group.items || []).forEach(item => {
          const entry = make('li');
          if (typeof item === 'object' && item.tool) {
            const button = make('button', item.label, 'tool-shortcut');
            button.type = 'button';
            button.dataset.tool = item.tool;
            button.setAttribute('aria-label', `Ask about ${item.label}`);
            entry.append(button);
          } else {
            entry.textContent = typeof item === 'string' ? item : item.label;
          }
          list.append(entry);
        });
        groupNode.append(list);
        grid.append(groupNode);
      });
      sectionNode.append(grid);
      catalogNode.append(sectionNode);
    });
    return catalogNode;
  }

  function contactDetails(type) {
    const profile = KB.profile || {};
    const details = {
      email: { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, aria: `Email ${profile.name} at ${profile.email}` },
      linkedin: { label: 'LinkedIn', value: displayUrl(profile.linkedin), href: profile.linkedin, aria: `Open ${profile.name}’s LinkedIn profile`, external: true },
      behance: { label: 'Behance', value: displayUrl(profile.behance), href: profile.behance, aria: `Open ${profile.name}’s Behance profile`, external: true },
      website: { label: 'Website', value: displayUrl(profile.website), href: profile.website, aria: `Open ${profile.name}’s portfolio` },
      location: { label: 'Location', value: profile.location }
    };
    return details[type] || null;
  }

  function contactLink(detail, label, className) {
    const anchor = make('a', null, className);
    anchor.href = detail.href;
    anchor.setAttribute('aria-label', detail.aria);
    if (detail.external) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
    anchor.append(make('span', label || detail.value), make('span', detail.external ? '↗' : '→', 'contact-arrow'));
    return anchor;
  }

  function contactCardComponent(config) {
    const card = make('section', null, 'contact-card');
    card.setAttribute('aria-label', config.title || 'Contact details');
    card.append(make('h3', config.title || 'Let’s talk'));
    const list = make('dl', null, 'contact-list');
    (config.fields || []).forEach(type => {
      const detail = contactDetails(type);
      if (!detail || !detail.value) return;
      const row = make('div', null, 'contact-row');
      row.append(make('dt', detail.label));
      const value = make('dd');
      if (detail.href) value.append(contactLink(detail, detail.value, 'contact-value'));
      else value.textContent = detail.value;
      row.append(value);
      list.append(row);
    });
    card.append(list);
    return card;
  }

  function contactActionsComponent(actions) {
    const list = make('div', null, 'contact-actions');
    actions.forEach(action => {
      const detail = contactDetails(action.type);
      if (detail && detail.href) list.append(contactLink(detail, action.label, 'contact-action'));
    });
    return list;
  }

  function shouldShowEvidence(topic) {
    if (evidenceTopics.has(topic.id)) return true;
    return Object.keys(KB.projects).some(id => topic.id === id || topic.id.startsWith(`${id}_`));
  }

  function orderedEvidenceLinks(links) {
    return [...(links || [])].sort((a, b) => {
      if (a.project === 'workspace' && b.project !== 'workspace') return -1;
      if (b.project === 'workspace' && a.project !== 'workspace') return 1;
      return 0;
    });
  }

  function answerComponent(topic, suggestedTopics) {
    const answer = make('div', null, 'answer');
    answer.tabIndex = -1;
    answer.append(make('h2', topic.question), make('p', topic.answer, 'short-answer'));

    if (topic.contactCard) answer.append(contactCardComponent(topic.contactCard));
    if (topic.contactActions && topic.contactActions.length) answer.append(contactActionsComponent(topic.contactActions));

    if (topic.catalog && topic.catalog.length) answer.append(catalogComponent(topic.catalog));

    if (topic.details && topic.details.length) {
      const details = make('ul', null, 'answer-details');
      topic.details.forEach(item => details.append(make('li', item)));
      answer.append(details);
    }

    const showEvidence = shouldShowEvidence(topic);
    if (showEvidence && topic.links && topic.links.length) {
      const evidenceLinks = orderedEvidenceLinks(topic.links);
      const evidence = make('div', null, 'evidence');
      evidence.append(make('p', 'Evidence', 'response-label'));
      const list = make('div', null, 'evidence-list');
      if (evidenceLinks.some(link => link.project)) list.classList.add('cards');
      evidenceLinks.forEach(link => list.append(projectLinkComponent(link)));
      evidence.append(list);
      answer.append(evidence);
      const firstProject = evidenceLinks.find(link => link.project);
      if (firstProject) {
        const schedule = window.requestIdleCallback || (callback => setTimeout(callback, 250));
        schedule(() => warmHref(projectHref(firstProject.project)));
      }
    }

    const followUpIds = suggestedTopics || topic.followUps || [];
    const validFollowUps = followUpIds.map(id => typeof id === 'string' ? topicMap.get(id) : id).filter(Boolean).slice(0, topic.followUpLimit || 4);
    if (validFollowUps.length) {
      const section = make('div', null, 'followup-section');
      section.append(make('p', 'Go deeper', 'response-label'));
      const list = make('div', null, 'followups');
      validFollowUps.forEach(item => list.append(chipComponent(item)));
      const linkedProject = showEvidence && orderedEvidenceLinks(topic.links).find(link => link.project);
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
    const toolButton = event.target.closest('[data-tool]');
    if (toolButton) {
      const tool = toolMap.get(toolButton.dataset.tool);
      if (tool) addTurn(`Do you use ${tool.name}?`, toolTopic(tool));
      return;
    }
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

  document.addEventListener('pointerover', warmLinkedPage, { passive: true });
  document.addEventListener('focusin', warmLinkedPage);
  document.addEventListener('touchstart', warmLinkedPage, { passive: true });

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
