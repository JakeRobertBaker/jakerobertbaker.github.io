// The pan/zoom view of the graph's world.
import type { Item } from './layout';

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
export type Camera = ReturnType<typeof createCamera>;

export function createCamera(viewport: HTMLElement, world: HTMLElement) {
  let view = { x: 0, y: 0, k: 1 };
  const apply = () => {
    const { x, y, k } = view;
    world.style.transform = `translate(${x}px, ${y}px) scale(${k})`;
    viewport.classList.toggle('is-far', k < .42);
  };
  const bounds = (subset: Item[]) => {
    const xs = subset.flatMap((item) => [item.x! - item.w / 2, item.x! + item.w / 2]);
    const ys = subset.flatMap((item) => [item.y! - item.h / 2, item.y! + item.h / 2]);
    return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
  };
  const glide = () => {
    if (reducedMotion.matches) return;
    world.classList.add('is-gliding');
    setTimeout(() => world.classList.remove('is-gliding'), 360);
  };
  const fit = (subset: Item[], animate = false) => {
    const { x0, x1, y0, y1 } = bounds(subset);
    const k = Math.min(viewport.clientWidth / (x1 - x0 + 48), viewport.clientHeight / (y1 - y0 + 48), 1.1);
    view = { k, x: viewport.clientWidth / 2 - k * (x0 + x1) / 2, y: viewport.clientHeight / 2 - k * (y0 + y1) / 2 };
    if (animate) glide();
    apply();
  };
  const zoomAt = (factor: number, px: number, py: number) => {
    const { x, y, k } = view;
    const next = Math.min(2.5, Math.max(.08, k * factor));
    view = { k: next, x: px - (px - x) * next / k, y: py - (py - y) * next / k };
    apply();
  };
  const pan = (dx: number, dy: number) => {
    view.x += dx;
    view.y += dy;
    apply();
  };
  // Pan the least distance that brings a whole box into view, favouring its
  // top-left corner when it is larger than the viewport.
  const reveal = (item: Item) => {
    const { x, y, k } = view, margin = 24;
    const shift = (start: number, size: number, room: number) =>
      Math.max(margin - start, Math.min(0, room - margin - start - size));
    const dx = shift((item.x! - item.w / 2) * k + x, item.w * k, viewport.clientWidth);
    const dy = shift((item.y! - item.h / 2) * k + y, item.h * k, viewport.clientHeight);
    if (!dx && !dy) return;
    view = { k, x: x + dx, y: y + dy };
    glide();
    apply();
  };
  return { fit, zoomAt, pan, reveal, glide, scale: () => view.k };
}
