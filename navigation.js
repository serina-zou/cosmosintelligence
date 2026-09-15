// Native details keeps the deeper navigation usable without JavaScript.
const navigationButton = document.querySelector('.menu-button');
const navigationMobile = document.querySelector('.mobile-nav');
function closeNavigation() {
  document.querySelectorAll('.nav-dropdown[open]').forEach(item => { item.open = false; });
  navigationMobile.hidden = true;
  navigationButton.setAttribute('aria-expanded', 'false');
  navigationButton.setAttribute('aria-label', 'Open navigation');
}
navigationButton.addEventListener('click', () => {
  const open = navigationButton.getAttribute('aria-expanded') !== 'true';
  navigationButton.setAttribute('aria-expanded', String(open));
  navigationButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigationMobile.hidden = !open;
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const dropdown = document.activeElement.closest('.nav-dropdown');
  if (dropdown?.open) {
    dropdown.open = false;
    dropdown.querySelector('summary').focus();
  } else if (!navigationMobile.hidden) {
    closeNavigation();
    navigationButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header, .mobile-nav')) closeNavigation();
});
document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
  dropdown.addEventListener('toggle', () => {
    if (!dropdown.open) return;
    dropdown.parentElement.querySelectorAll('.nav-dropdown').forEach(other => {
      if (other !== dropdown) other.open = false;
    });
  });
});
