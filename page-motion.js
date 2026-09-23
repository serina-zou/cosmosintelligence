// Inner pages share Home's reveal styles without its homepage-only routing.
(() => {
  const page = document.querySelector('.knowledge-page');
  if (!page || !('IntersectionObserver' in window)) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 981px)');
  const panels = [...page.querySelectorAll('.content-panel')];
  const visiblePanels = new Set();
  let frame = 0;

  panels.forEach(panel => {
    panel.querySelectorAll('h1, h2').forEach(heading => {
      const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      let index = 0;
      nodes.forEach(node => {
        const fragment = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(part => {
          if (!part.trim()) { fragment.append(part); return; }
          const word = document.createElement('span');
          word.className = 'word';
          word.style.setProperty('--word-index', Math.min(index++, 12));
          word.textContent = part;
          fragment.append(word);
        });
        node.replaceWith(fragment);
      });
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        visiblePanels.add(target);
        target.querySelectorAll('.reveal').forEach(item => item.classList.add('in-view'));
      } else visiblePanels.delete(target);
    });
    scheduleParallax();
  }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

  function updateParallax() {
    frame = 0;
    if (reducedMotion.matches || !desktop.matches) return;
    visiblePanels.forEach(panel => {
      const rect = panel.getBoundingClientRect();
      const offset = Math.max(-18, Math.min(18, (innerHeight / 2 - rect.top) * .035));
      panel.style.setProperty('--image-parallax', `${offset}px`);
    });
  }
  function scheduleParallax() {
    if (!frame) frame = requestAnimationFrame(updateParallax);
  }
  function configureMotion() {
    observer.disconnect();
    visiblePanels.clear();
    page.classList.toggle('motion-enabled', !reducedMotion.matches);
    panels.forEach(panel => {
      panel.style.removeProperty('--image-parallax');
      panel.querySelectorAll('.panel-content, .section-image').forEach(item => {
        item.classList.toggle('reveal', !reducedMotion.matches);
        item.classList.toggle('in-view', reducedMotion.matches);
      });
      if (!reducedMotion.matches) observer.observe(panel);
    });
  }
  reducedMotion.addEventListener('change', configureMotion);
  desktop.addEventListener('change', () => {
    panels.forEach(panel => panel.style.removeProperty('--image-parallax'));
    scheduleParallax();
  });
  document.addEventListener('scroll', scheduleParallax, { passive: true });
  window.addEventListener('resize', scheduleParallax, { passive: true });
  configureMotion();
})();
