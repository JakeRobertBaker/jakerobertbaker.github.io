// Keep Starlight's native sidebar, Menu/X, focus/inert handling and dismissal.
// Only extend the native popover to desktop and observe the scroll-away header.
export {};
const masthead = document.querySelector<HTMLElement>('.page > header');
if (masthead) {
  new IntersectionObserver(([entry]) => {
    document.documentElement.toggleAttribute('data-masthead-away', !entry.isIntersecting);
  }).observe(masthead);
}

void customElements.whenDefined('sl-sidebar-pane').then(() => {
  const pane = document.querySelector<HTMLElement>('#starlight__sidebar');
  if (!pane) return;
  const update = () => {
    if (pane.popover !== 'auto') pane.popover = 'auto';
  };
  // Run after Starlight's listener, which removes popover on desktop.
  matchMedia('(min-width: 50rem)').addEventListener('change', update);
  update();
});
