(() => {
  let count = 0;
  function enhance() {
    document.querySelectorAll('.studio-group').forEach(group => {
      const header = group.firstElementChild;
      const label = header && header.firstElementChild;
      const panel = header && header.nextElementSibling;
      if (!label || !panel || header.querySelector('.studio-group-toggle')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'studio-group-toggle';
      button.textContent = label.textContent;
      panel.id = 'studio-fields-' + (++count);
      button.setAttribute('aria-controls', panel.id);
      button.setAttribute('aria-expanded', 'true');
      label.hidden = true;
      header.insertBefore(button,label);
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        panel.hidden = expanded;
      });
    });
    const title = document.querySelector('.studio h1')?.textContent;
    document.querySelectorAll('.studio .side > button').forEach(button => {
      const active = button.textContent === title || (button.textContent === 'Work' && !!document.querySelector('.studio button[style*="margin-bottom: 12px"]'));
      if (active) button.setAttribute('aria-current','page');
      else button.removeAttribute('aria-current');
    });
  }
  let scheduled = false;
  new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {scheduled=false;enhance();});
  }).observe(document.body,{childList:true,subtree:true});
  enhance();
})();
