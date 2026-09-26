// Progressive enhancement: all text remains readable when JavaScript is off.
document.querySelectorAll('.knowledge-page [data-text-carousel]').forEach((carousel, number) => {
  const track = carousel.querySelector('.carousel-track');
  const slides = [...track.children];
  if (slides.length < 2) return;
  let active = 0;
  let scheduled = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  track.id = `text-carousel-${number + 1}`;
  track.tabIndex = 0;
  track.setAttribute('aria-label', 'Text slides. Use left and right arrow keys to navigate.');
  carousel.setAttribute('aria-roledescription', 'carousel');
  slides.forEach((slide, index) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} of ${slides.length}`);
  });

  const controls = document.createElement('div');
  controls.className = 'carousel-controls';
  const counter = document.createElement('span');
  counter.className = 'carousel-counter';
  counter.setAttribute('aria-live', 'polite');
  counter.setAttribute('aria-atomic', 'true');
  function button(label, symbol, direction) {
    const item = document.createElement('button');
    item.type = 'button';
    item.textContent = symbol;
    item.setAttribute('aria-label', label);
    item.setAttribute('aria-controls', track.id);
    item.addEventListener('click', () => go(active + direction));
    return item;
  }
  const previous = button('Previous text slide', '←', -1);
  const next = button('Next text slide', '→', 1);
  controls.append(previous, counter, next);
  carousel.append(controls);
  carousel.classList.add('is-carousel');

  function update() {
    if (track.clientWidth) active = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
    previous.disabled = active === 0;
    next.disabled = active === slides.length - 1;
    counter.textContent = `${active + 1} / ${slides.length}`;
    slides.forEach((slide, index) => { slide.inert = index !== active; });
  }
  function go(index) {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    track.scrollTo({ left: target * track.clientWidth, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }
  track.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; update(); });
  }, { passive: true });
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    const destinations = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    go(destinations[event.key]);
  });
  if ('ResizeObserver' in window) {
    let width = track.clientWidth;
    new ResizeObserver(() => {
      if (width === track.clientWidth) return;
      width = track.clientWidth;
      track.scrollTo({ left: active * width, behavior: 'instant' });
    }).observe(track);
  }
  update();
});
