// Pointer gestures: drag a card or proof, pan the background, pinch to zoom.
// Capture starts only once a gesture moves, so plain clicks reach links.
import type { Simulation } from 'd3-force';
import type { Camera } from './camera';
import type { Item } from './layout';

export function attachGestures(viewport: HTMLElement, camera: Camera, items: Item[], simulation: Simulation<Item, undefined>) {
  let gesture: { id: number; item?: Item; x: number; y: number; moved: boolean } | null = null;
  const pointers = new Map<number, { x: number; y: number }>();
  let pinch: { distance: number } | null = null;
  let suppressClick = false;

  const local = (event: { clientX: number; clientY: number }) => {
    const box = viewport.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  };
  const spread = () => {
    const [a, b] = [...pointers.values()];
    return { distance: Math.hypot(a.x - b.x, a.y - b.y), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  };
  const release = () => {
    if (gesture?.item && gesture.moved) {
      gesture.item.fx = gesture.item.fy = null;
      simulation.alphaTarget(0);
    }
    viewport.classList.remove('is-panning');
    gesture = null;
  };
  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointers.set(event.pointerId, local(event));
    if (pointers.size === 2) {
      release();
      pinch = { distance: spread().distance };
      return;
    }
    const el = (event.target as Element).closest<HTMLElement>('.tg-node, .tg-proof');
    const item = el ? items.find((candidate) => candidate.el === el) : undefined;
    gesture = { id: event.pointerId, item, x: event.clientX, y: event.clientY, moved: false };
  });
  viewport.addEventListener('pointermove', (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, local(event));
    if (pinch && pointers.size === 2) {
      const now = spread();
      camera.zoomAt(now.distance / pinch.distance, now.x, now.y);
      pinch.distance = now.distance;
      return;
    }
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
    if (!gesture.moved) {
      if (Math.hypot(dx, dy) < 5) return;
      gesture.moved = true;
      viewport.setPointerCapture(event.pointerId);
      if (gesture.item) {
        gesture.item.fx = gesture.item.x;
        gesture.item.fy = gesture.item.y;
        simulation.alphaTarget(.25).restart();
      } else viewport.classList.add('is-panning');
    }
    gesture.x = event.clientX;
    gesture.y = event.clientY;
    if (gesture.item) {
      const k = camera.scale();
      gesture.item.fx! += dx / k;
      gesture.item.fy! += dy / k;
    } else camera.pan(dx, dy);
  });
  const end = (event: PointerEvent) => {
    pointers.delete(event.pointerId);
    if (pointers.size < 2) pinch = null;
    if (gesture?.id === event.pointerId) {
      suppressClick = gesture.moved;
      release();
    }
  };
  // A native link drag would cancel the pointer gesture on titles and proofs.
  viewport.addEventListener('dragstart', (event) => event.preventDefault());
  viewport.addEventListener('pointerup', end);
  viewport.addEventListener('pointercancel', end);
  viewport.addEventListener('wheel', (event) => {
    event.preventDefault();
    const { x, y } = local(event);
    // Trackpad pinches arrive as ctrl+wheel with small deltas.
    camera.zoomAt(Math.exp(-event.deltaY * (event.ctrlKey ? .01 : .0015)), x, y);
  }, { passive: false });

  return {
    dragging: (item: Item) => gesture?.item === item && gesture.moved,
    /** True once if the click ending a drag or pan should be ignored. */
    takeSuppressedClick: () => { const value = suppressClick; suppressClick = false; return value; },
  };
}
