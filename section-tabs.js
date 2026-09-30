// Native content remains visible until tabs are successfully initialized.
(() => {
  const groups = [];
  document.querySelectorAll('[data-chapter-tabs]').forEach((group, groupIndex) => {
    const panes = [...group.querySelector('.chapter-panes').children];
    if (panes.length < 2) return;
    const nav = document.createElement('div');
    nav.className = 'chapter-tabs';
    nav.setAttribute('role', 'tablist');
    nav.setAttribute('aria-label', group.querySelector('h2').textContent);
    let previewTimer;
    const buttons = panes.map((pane, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.id = `chapter-${groupIndex + 1}-tab-${index + 1}`;
      button.textContent = pane.dataset.tabLabel;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', pane.id);
      pane.setAttribute('role', 'tabpanel');
      pane.setAttribute('aria-labelledby', button.id);
      pane.tabIndex = 0;
      button.addEventListener('click', () => activate(index));
      button.addEventListener('pointerenter', event => {
        if (event.pointerType !== 'mouse' || group.querySelector('.chapter-panes').contains(document.activeElement)) return;
        previewTimer = setTimeout(() => activate(index), 180);
      });
      button.addEventListener('pointerleave', () => clearTimeout(previewTimer));
      button.addEventListener('keydown', event => {
        const targets = { ArrowRight: (index + 1) % panes.length, ArrowLeft: (index + panes.length - 1) % panes.length, Home: 0, End: panes.length - 1 };
        if (!(event.key in targets)) return;
        event.preventDefault();
        const next = targets[event.key];
        activate(next);
        buttons[next].focus({ preventScroll: true });
        buttons[next].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
      });
      nav.append(button);
      return button;
    });
    function activate(index) {
      clearTimeout(previewTimer);
      panes.forEach((pane, i) => {
        pane.hidden = i !== index;
        buttons[i].setAttribute('aria-selected', String(i === index));
        buttons[i].tabIndex = i === index ? 0 : -1;
      });
    }
    group.querySelector('.chapter-stage').before(nav);
    group.classList.add('is-tabbed');
    activate(0);
    groups.push({ panes, activate });
  });
  function revealAnchor() {
    const target = document.getElementById(location.hash.slice(1));
    if (!target) return;
    groups.forEach(({ panes, activate }) => {
      const index = panes.findIndex(pane => pane === target || pane.contains(target));
      if (index >= 0) activate(index);
    });
    const details = target.closest('details');
    if (details) details.open = true;
    requestAnimationFrame(() => {
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
      history.replaceState(null, '', location.pathname + location.search);
    });
  }
  window.addEventListener('hashchange', revealAnchor);
  revealAnchor();
})();
