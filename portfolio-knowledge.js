/*
  Portfolio conversation knowledge base.
  Edit topics, answers, links, and follow-ups here; the conversation UI reads
  this file and never generates claims beyond this predefined content.
*/
(function () {
  'use strict';

  var projects = {
    kriyam: {
      id: 'kriyam',
      name: 'Kriyam.ai',
      title: 'Built for trust. Designed for scale.',
      tag: 'BFSI · Web & Mobile',
      image: 'uploads/Kriyam%20Mockup.jpg',
      short: 'Insurance field-verification across web and mobile.',
      problem: 'Sensitive verification cases moved through calls, WhatsApp, and email. Teams lacked SLA control, an audit trail, and a secure way to share customer data.',
      role: 'As Senior UI/UX Designer, I owned research, workflow mapping, interaction design, and iteration from concept through launch with product, engineering, and QA.',
      decisions: 'I connected structured case assignment, guided inputs, encrypted data handling, location tracking, and automatic audit logs into one traceable workflow.',
      impact: 'Turnaround time fell 30%, report errors fell 80%, data leakage reached zero, and AI summaries save clients about 12 hours each week.',
      proof: '30% faster turnaround · 80% fewer report errors · zero data leakage',
      clients: ['PNB MetLife', 'Kotak Life', 'Toyota Financial Services', 'Edelweiss Life Insurance']
    },
    proteger: {
      id: 'proteger',
      name: 'Proteger Collect',
      title: 'Building tomorrow’s smart factories',
      tag: 'Manufacturing · Web & Tablet',
      image: 'uploads/391985742_854c309b-66af-4b9a-a203-12cf7fae41dc%202.jpg',
      short: 'Factory operations across web, tablet, and mobile.',
      problem: 'Factory teams recorded maintenance, quality, and material data on paper in conditions where ordinary interfaces were difficult to use.',
      role: 'I conducted research on factory floors and designed the experience across data capture, tracking, maintenance, quality, and analytics.',
      decisions: 'I enlarged touch targets, simplified checksheets, designed for harsh lighting, and made voice and vision the long-term interaction model.',
      impact: 'Data capture became 35% faster, each worker saves about 15 minutes per shift, errors fell 40%, and downtime reduced by 30–40%.',
      proof: '35% faster capture · 40% fewer errors · 30–40% less downtime',
      clients: ['Tata Electronics', 'Maruti Suzuki']
    },
    goodbook: {
      id: 'goodbook',
      name: 'Goodbook',
      title: 'Attendance, payroll and HR — beautifully simple',
      tag: 'Enterprise HR · Web & Mobile',
      image: 'uploads/138817034_9b8cfbdd-ec88-42cb-af03-f4cdb9f0cff3.jpg',
      short: 'HR, attendance, and payroll across web and mobile.',
      problem: 'HR and finance teams reconciled attendance and payroll manually while employees waited for payslips and corrections.',
      role: 'I led the product experience across employee mobile, the HR web platform, and a facial-recognition check-in layer.',
      decisions: 'I separated quick employee tasks from deep HR controls and connected liveness-verified attendance to automated payroll and payslip access.',
      impact: 'Payroll processing became 70% faster, payslip requests dropped 100%, attendance reached 90% accuracy, and check-in became 30–40% faster.',
      proof: '70% faster payroll · 100% fewer payslip requests · 90% attendance accuracy'
    },
    workspace: {
      id: 'workspace',
      name: 'WorkSpace',
      title: 'WorkSpace',
      tag: 'Case study · Product design',
      image: 'uploads/Case%20cover.jpg',
      short: 'Configurable enterprise case management.',
      problem: 'Every client used different field names, sections, and case processes. A fixed product created a translation tax during onboarding and support.',
      role: 'As Product Designer, I shaped the configuration model, setup experience, editable rules, and how those choices carried into daily casework.',
      decisions: 'Labels, fields, sections, and visibility rules remain editable after launch while one consistent case model stays underneath.',
      impact: 'Onboarding is about 30% faster, rename and add-column requests are down 85–90%, and time to the first live case fell around 60%.',
      proof: '30% faster onboarding · 85–90% fewer support requests · 60% faster activation'
    },
    buseit: {
      id: 'buseit',
      name: 'Buy it. Use it. Sell it.',
      title: 'Buy it. Use it. Sell it.',
      tag: 'C2C · iOS & Android',
      image: 'uploads/b2.png',
      short: 'A trust-first consumer resale marketplace.',
      problem: 'Second-hand commerce breaks when buyers cannot trust strangers and occasional sellers face flows built for professional merchants.',
      role: 'I worked as UI/UX Designer and Product Manager, moving from research and flows to more than 70 high-fidelity screens in four weeks.',
      decisions: 'I used DigiLocker for identity, kept listing short, surfaced escrow and inspection at decision points, and mapped disputes and failure paths.',
      impact: 'The outcome was a complete build-ready MVP covering verification, escrow, inspection, logistics, refunds, cancellations, and edge cases.',
      proof: '70+ screens · four-week delivery · end-to-end trust and dispute flows'
    }
  };

  function projectLink(id, label) {
    return { project: id, label: label || 'View case study', evidence: projects[id].proof };
  }

  var topics = [
    {
      id: 'best_work', question: 'Show me your best work', shortLabel: 'Best work', primary: true,
      keywords: ['best work', 'top work', 'strongest work', 'portfolio highlights', 'best projects'],
      variations: ['show me your best work', 'what are your best projects', 'show portfolio highlights'],
      answer: 'Kriyam shows secure enterprise workflow design, Proteger shows field research in difficult physical environments, and WorkSpace shows systems thinking. Together they cover research, strategy, interaction design, and measurable operational impact.',
      links: [projectLink('kriyam'), projectLink('proteger'), projectLink('workspace')],
      followUps: ['kriyam', 'proteger', 'workspace']
    },
    {
      id: 'products', question: 'What kind of products have you worked on?', shortLabel: 'Products', primary: true,
      keywords: ['products', 'product types', 'platforms', 'what have you built', 'worked on'],
      variations: ['what kind of products have you worked on', 'what products did you design', 'types of products'],
      answer: 'I have designed insurance verification, factory operations, HR and payroll, marketing analytics, configurable case management, agentic AI, and a consumer resale marketplace. Most span several roles and surfaces across web, tablet, and mobile.',
      links: [projectLink('kriyam'), projectLink('proteger'), projectLink('goodbook'), projectLink('buseit')],
      followUps: ['industries', 'clients', 'case_studies']
    },
    {
      id: 'impact', question: 'What impact have you created?', shortLabel: 'Impact', primary: true,
      keywords: ['impact', 'results', 'outcomes', 'metrics', 'numbers', 'success'],
      variations: ['what impact have you created', 'show me results', 'what outcomes did your work create'],
      answer: 'I focus on time saved, errors removed, and trust created. Across the portfolio that includes faster verification and payroll, fewer factory errors, zero data leakage, and less support needed to onboard enterprise clients.',
      links: [projectLink('kriyam'), projectLink('proteger'), projectLink('goodbook'), projectLink('workspace')],
      followUps: ['kriyam_impact', 'proteger_impact', 'goodbook_impact', 'measuring_success']
    },
    {
      id: 'process', question: 'How do you approach design problems?', shortLabel: 'Process', primary: true,
      keywords: ['process', 'approach', 'design problems', 'problem solving', 'methodology', 'how do you design'],
      variations: ['how do you approach design problems', 'what is your design process', 'how do you solve problems'],
      answer: 'I start by understanding the problem before designing a solution. I study user behaviour, data, business needs, stakeholder goals, technical constraints, and development effort, then keep asking why until the root cause is clear. Exploration and validation come after that.',
      links: [projectLink('proteger', 'See research in context'), projectLink('workspace', 'See systems thinking in context')],
      followUps: ['research', 'data', 'stakeholders', 'disagreements']
    },
    {
      id: 'skills', question: 'What are your skills & tools?', shortLabel: 'Skills & tools', primary: true,
      keywords: ['skills', 'strengths', 'capabilities', 'expertise', 'skills and tools'],
      variations: ['what are your skills and tools', 'what are you good at', 'your capabilities'],
      answer: 'My core strengths are product and UX design, research, strategy, information architecture, prototyping, usability testing, design systems, accessibility, analytics-driven design, stakeholder collaboration, and developer handoff.',
      details: ['Product & UX design', 'Research & UX strategy', 'Design systems & accessibility', 'Analytics-driven iteration', 'Cross-functional leadership'],
      links: [projectLink('kriyam'), projectLink('proteger')],
      followUps: ['tools', 'figma', 'ai_tools', 'design_systems']
    },
    {
      id: 'projects', question: 'Show me your projects', shortLabel: 'Projects',
      keywords: ['projects', 'project list', 'portfolio', 'all work'],
      variations: ['show me your projects', 'what projects have you done', 'show all work'],
      answer: 'The portfolio includes five published case studies across enterprise and consumer products. Each one documents the problem, my role, key decisions, and outcomes.',
      links: [projectLink('kriyam'), projectLink('proteger'), projectLink('goodbook'), projectLink('workspace'), projectLink('buseit')],
      followUps: ['best_work', 'products', 'case_studies']
    },
    {
      id: 'experience', question: 'Tell me about your experience', shortLabel: 'Experience',
      keywords: ['experience', 'career', 'work history', 'seniority'],
      variations: ['tell me about your experience', 'what is your experience', 'career background'],
      answer: 'I am a Senior UX and Product Designer with more than five years of experience designing complex web and mobile products across finance, AI, HR technology, marketing analytics, and operational systems.',
      links: [projectLink('kriyam'), projectLink('proteger')],
      followUps: ['experience_years', 'background', 'clients', 'best_work']
    },
    {
      id: 'experience_years', question: 'How many years of experience do you have?', shortLabel: 'Experience length',
      keywords: ['years experience', 'how long', 'experience years', '5 years', 'five years'],
      variations: ['how many years of experience do you have', 'how long have you been designing'],
      answer: 'I have more than five years of experience across UX and product design, working from research and strategy through interaction design, systems, handoff, and post-launch improvement.',
      links: [projectLink('kriyam'), projectLink('proteger')],
      followUps: ['experience', 'skills', 'clients']
    },
    {
      id: 'background', question: 'What is your background?', shortLabel: 'Background',
      keywords: ['background', 'about you', 'who are you', 'education', 'your story'],
      variations: ['what is your background', 'tell me about yourself', 'who is akash'],
      answer: 'My path into product design began with political science and a habit of questioning how systems work. That perspective now helps me examine incentives, constraints, and human behaviour before shaping a product response.',
      links: [{ href: 'explore.html#about', label: 'Read the full background' }],
      followUps: ['experience', 'design_strength', 'process']
    },
    {
      id: 'industries', question: 'Which industries have you worked in?', shortLabel: 'Industries',
      keywords: ['industries', 'domains', 'sectors', 'bfsi', 'hr technology', 'factory management', 'agentic ai', 'marketing analytics'],
      variations: ['which industries have you worked in', 'what domains do you know'],
      answer: 'My domain experience covers BFSI, agentic AI, HR technology, marketing analytics, and factory-management or operational systems. I have also designed a consumer resale marketplace.',
      links: [projectLink('kriyam'), projectLink('proteger'), projectLink('goodbook'), projectLink('buseit')],
      followUps: ['products', 'clients', 'projects']
    },
    {
      id: 'clients', question: 'Which clients or brands have you worked with?', shortLabel: 'Clients',
      keywords: ['clients', 'brands', 'companies', 'pnb', 'kotak', 'toyota', 'edelweiss', 'tata', 'maruti'],
      variations: ['which clients have you worked with', 'brands you worked for', 'client list'],
      answer: 'Through Kriyam I worked on needs connected to PNB MetLife, Kotak Life, Toyota Financial Services, and Edelweiss Life Insurance. Proteger work included Tata Electronics and Maruti Suzuki.',
      links: [projectLink('kriyam', 'See the Kriyam work'), projectLink('proteger', 'See the Proteger work')],
      followUps: ['kriyam', 'proteger', 'industries']
    },
    {
      id: 'research', question: 'How do you do user research?', shortLabel: 'Research',
      keywords: ['research', 'user interviews', 'field study', 'discovery', 'user feedback'],
      variations: ['how do you do user research', 'tell me about research', 'your discovery process'],
      answer: 'I use interviews, contextual observation, workflow mapping, usability testing, and existing product evidence. The method depends on the risk: on Proteger that meant factory-floor research; on enterprise products it often means comparing user behaviour across roles and handoffs.',
      links: [projectLink('proteger', 'See factory-floor research'), projectLink('kriyam', 'See enterprise workflow research')],
      followUps: ['data', 'process', 'measuring_success']
    },
    {
      id: 'data', question: 'How do you use data in design?', shortLabel: 'Data',
      keywords: ['data', 'analytics', 'metrics', 'tracking', 'clarity', 'hotjar'],
      variations: ['how do you use data', 'do you use analytics', 'data driven design'],
      answer: 'I use product and usage data, Microsoft Clarity, Hotjar, user feedback, and usability observations to find friction and check whether a design improved the intended outcome. Data informs the decision; it does not replace understanding the user context.',
      links: [projectLink('workspace', 'See measured onboarding outcomes'), projectLink('goodbook', 'See payroll and attendance outcomes')],
      followUps: ['measuring_success', 'research', 'impact']
    },
    {
      id: 'measuring_success', question: 'How do you measure design success?', shortLabel: 'Measuring success',
      keywords: ['measure success', 'after launch', 'post launch', 'kpi', 'evaluate design'],
      variations: ['how do you measure design success', 'what happens after launch'],
      answer: 'After launch I review usage data, analytics, user feedback, usability observations, and the friction that remains. Smaller improvements are then weighed against user value, technical constraints, development effort, and business requirements.',
      links: [projectLink('workspace'), projectLink('kriyam')],
      followUps: ['data', 'impact', 'collaboration']
    },
    {
      id: 'stakeholders', question: 'How do you work with stakeholders?', shortLabel: 'Stakeholders',
      keywords: ['stakeholders', 'product manager', 'pm', 'business requirements', 'leadership'],
      variations: ['how do you work with stakeholders', 'stakeholder management'],
      answer: 'I make the reasoning visible: user need, business goal, technical constraint, and expected effort. I listen for what each stakeholder is protecting, then frame decisions around the best product outcome rather than a design preference.',
      links: [projectLink('kriyam', 'See cross-functional delivery')],
      followUps: ['disagreements', 'collaboration', 'engineering']
    },
    {
      id: 'collaboration', question: 'How do you collaborate with a team?', shortLabel: 'Collaboration',
      keywords: ['collaboration', 'teamwork', 'cross functional', 'work with team', 'qa'],
      variations: ['how do you collaborate', 'how do you work with teams'],
      answer: 'I work with product, engineering, and QA throughout the build rather than handing over finished screens. Reviews, implementation questions, and QA findings feed back into the design until the workflow holds up in the real product.',
      links: [projectLink('kriyam', 'See the delivery model')],
      followUps: ['engineering', 'stakeholders', 'disagreements']
    },
    {
      id: 'engineering', question: 'How do you work with engineers?', shortLabel: 'Engineering',
      keywords: ['engineers', 'engineering', 'developers', 'developer handoff', 'handoff', 'technical'],
      variations: ['how do you work with engineers', 'what is your handoff process'],
      answer: 'I involve engineers early, discuss constraints and effort before committing to a direction, document the important behaviour, and stay available during implementation. The goal is shared ownership of the experience rather than a one-way handoff.',
      links: [projectLink('kriyam'), projectLink('proteger')],
      followUps: ['collaboration', 'disagreements', 'design_systems']
    },
    {
      id: 'disagreements', question: 'How do you handle disagreements?', shortLabel: 'Disagreements',
      keywords: ['disagreement', 'conflict', 'pushback', 'different opinion', 'argument'],
      variations: ['how do you handle disagreements', 'what if a pm disagrees', 'conflict with engineer'],
      answer: 'I first understand the other person’s reasoning, then explain mine using user evidence and available data. We consider business needs, technical constraints, and effort. If uncertainty remains, I prefer a small test over trying to win the argument.',
      links: [projectLink('kriyam', 'See collaborative iteration')],
      followUps: ['stakeholders', 'engineering', 'data']
    },
    {
      id: 'tools', question: 'What tools do you use?', shortLabel: 'Tools',
      keywords: ['tools', 'software', 'apps', 'design tools', 'what do you use'],
      variations: ['what tools do you use', 'tools?', 'what software do you know', 'your design tools', 'do you use figma', 'software you work with'],
      answer: 'My toolkit spans design, prototyping, motion, analytics, and lightweight implementation. I choose tools based on the problem and the team rather than treating any one tool as the process.',
      details: ['Figma · Framer · Webflow', 'Illustrator · Photoshop · Premiere Pro · After Effects', 'Microsoft Clarity · Hotjar', 'Zoho · basic HTML & CSS'],
      links: [projectLink('buseit', 'See a rapid high-fidelity workflow')],
      followUps: ['figma', 'ai_tools', 'design_systems']
    },
    {
      id: 'figma', question: 'Do you use Figma?', shortLabel: 'Figma',
      keywords: ['figma', 'figma make', 'prototype in figma'],
      variations: ['do you use figma', 'how do you use figma'],
      answer: 'Yes. I use Figma for flows, interface design, prototypes, component systems, developer handoff, and collaborative reviews. The fidelity depends on what the team needs to learn or build next.',
      links: [projectLink('buseit'), projectLink('workspace')],
      followUps: ['tools', 'design_systems', 'ai_tools']
    },
    {
      id: 'ai_tools', question: 'Which AI tools do you use?', shortLabel: 'AI tools',
      keywords: ['ai tools', 'vibe coding', 'codex', 'claude', 'lovable', 'relume', 'figma make'],
      variations: ['which ai tools do you use', 'do you use ai', 'your vibe coding tools'],
      answer: 'For AI-assisted exploration and building I use Codex, Claude, Lovable, Relume AI, and Figma Make. I use them to accelerate research synthesis, prototyping, content structure, and implementation while keeping human review and product judgment in the loop.',
      links: [{ href: 'explore.html#work', label: 'Explore the portfolio' }],
      followUps: ['tools', 'figma', 'process']
    },
    {
      id: 'design_systems', question: 'What is your design-systems experience?', shortLabel: 'Design systems',
      keywords: ['design systems', 'components', 'tokens', 'component library', 'accessibility'],
      variations: ['what is your design systems experience', 'do you build design systems'],
      answer: 'I build tokens, components, variants, interaction rules, and usage guidance so teams can ship consistently. I treat accessibility and implementation behaviour as part of the system, not as documentation added at the end.',
      links: [projectLink('workspace'), projectLink('goodbook')],
      followUps: ['figma', 'engineering', 'skills']
    },
    {
      id: 'case_studies', question: 'Show me the case studies', shortLabel: 'Case studies',
      keywords: ['case studies', 'case study', 'detailed work', 'full projects'],
      variations: ['show me case studies', 'where are the full case studies'],
      answer: 'There are five published case studies. Each one gives a different view of the work: secure enterprise workflows, factory research, HR automation, configurable systems, and consumer trust.',
      links: [projectLink('kriyam'), projectLink('proteger'), projectLink('goodbook'), projectLink('workspace'), projectLink('buseit')],
      followUps: ['best_work', 'products', 'impact']
    },
    {
      id: 'design_strength', question: 'What is your strongest quality as a designer?', shortLabel: 'Design strength',
      keywords: ['strongest quality', 'strength', 'best quality', 'root cause'],
      variations: ['what is your strongest quality', 'your biggest design strength'],
      answer: 'My strongest quality is digging into the root cause. I listen closely, question assumptions, and keep asking why until I understand what we are actually trying to solve. I would rather spend time solving the right problem than rush into the first solution.',
      links: [projectLink('proteger'), projectLink('workspace')],
      followUps: ['process', 'research', 'data']
    }
  ];

  Object.keys(projects).forEach(function (id) {
    var project = projects[id];
    topics.push({
      id: id, question: 'Tell me about ' + project.name, shortLabel: project.name,
      keywords: [project.name.toLowerCase(), id, project.short.toLowerCase()],
      variations: ['tell me about ' + project.name, 'show me ' + project.name],
      answer: project.short + ' ' + project.problem,
      links: [projectLink(id)],
      followUps: [id + '_problem', id + '_role', id + '_decisions', id + '_impact']
    });
    ['problem', 'role', 'decisions', 'impact'].forEach(function (aspect) {
      var labels = { problem: 'See the problem', role: 'My role', decisions: 'Key decisions', impact: 'See the outcome' };
      topics.push({
        id: id + '_' + aspect,
        question: labels[aspect] + ' — ' + project.name,
        shortLabel: labels[aspect],
        keywords: [project.name.toLowerCase() + ' ' + aspect, id + ' ' + aspect],
        variations: [aspect + ' in ' + project.name, project.name + ' ' + aspect],
        answer: project[aspect],
        links: [projectLink(id)],
        followUps: ['problem', 'role', 'decisions', 'impact'].filter(function (item) { return item !== aspect; }).map(function (item) { return id + '_' + item; })
      });
    });
  });

  window.PORTFOLIO_KNOWLEDGE = {
    primaryIds: ['best_work', 'products', 'impact', 'process', 'skills'],
    projects: projects,
    topics: topics
  };
})();
