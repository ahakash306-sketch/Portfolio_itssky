(() => {
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
