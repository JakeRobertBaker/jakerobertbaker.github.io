// Progressive enhancement for <theorem-graph>: the server renders cards and
// proofs as a list; this lays them out on a pan/zoom canvas and wires the parts.
import { createCamera, reducedMotion } from './camera';
import { createEdges } from './edges';
import { attachGestures } from './gestures';
import { createSimulation, type Edge, type Item } from './layout';
import { createSelection, type Mode } from './selection';

class TheoremGraph extends HTMLElement {
  private started = false;

  connectedCallback() {
    if (this.started) return;
    this.started = true;
    void this.start();
  }

  private async start() {
    const viewport = this.querySelector<HTMLElement>('.theorem-graph__viewport')!;
    const world = this.querySelector<HTMLElement>('.theorem-graph__world')!;
    const svg = this.querySelector<SVGSVGElement>('.theorem-graph__edges')!;
    const panel = this.querySelector<HTMLElement>('.theorem-graph__panel')!;
    const edges: Edge[] = JSON.parse(this.querySelector('script[type="application/json"]')!.textContent!);
    const cards = [...this.querySelectorAll<HTMLElement>('.tg-node')];
    const chips = [...this.querySelectorAll<HTMLAnchorElement>('.tg-proof')];
    this.toggleAttribute('data-ready', true);
    // Box sizes depend on KaTeX and book fonts; measure once they are ready.
    await document.fonts.ready;
    const measure = (el: HTMLElement, card: boolean): Item => ({ el, card, w: el.offsetWidth, h: el.offsetHeight });
    const nodes = cards.map((el) => measure(el, true));
    const proofs = chips.map((el) => measure(el, false));
    const items = [...nodes, ...proofs];
    const { simulation, linkForce } = createSimulation(nodes, proofs, edges);
    const { groups, draw: drawEdges } = createEdges(svg, edges, nodes, proofs);
    const camera = createCamera(viewport, world);

    const draw = () => {
      // Centre-anchored, so labels enlarged at far zoom stay on their curves.
      for (const item of items)
        item.el.style.transform = `translate(${item.x!.toFixed(1)}px, ${item.y!.toFixed(1)}px) translate(-50%, -50%)`;
      drawEdges();
    };
    const layout = (animate: boolean) => {
      for (const item of items) delete item.x, delete item.y, delete item.vx, delete item.vy, item.fx = item.fy = null;
      simulation.nodes(items).alpha(1);
      if (animate && !reducedMotion.matches) { simulation.restart(); return; }
      simulation.tick(Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())));
      draw();
      camera.fit(items);
    };
    simulation.on('tick', draw);
    layout(false);

    const gestures = attachGestures(viewport, camera, items, simulation);
    const selection = createSelection({ host: this, panel, cards, chips, edges, groups });

    // Cards start as titles; opening one shows its statement and the layout
    // briefly re-settles around its new size.
    const statements = this.querySelector<HTMLButtonElement>('[data-action="statements"]')!;
    const open = (indices: number[], value: boolean) => {
      for (const i of indices) {
        cards[i].classList.toggle('is-open', value);
        cards[i].setAttribute('aria-expanded', String(value));
        nodes[i].w = cards[i].offsetWidth;
        nodes[i].h = cards[i].offsetHeight;
      }
      statements.setAttribute('aria-pressed', String(cards.every((card) => card.classList.contains('is-open'))));
      linkForce.distance(linkForce.distance());
      // A single card stays where it was clicked while its neighbours move.
      const held = indices.length === 1 ? nodes[indices[0]] : null;
      if (held && held.fx == null) [held.fx, held.fy] = [held.x, held.y];
      const release = () => { if (held && !gestures.dragging(held)) held.fx = held.fy = null; };
      if (reducedMotion.matches) { simulation.alpha(.35).tick(150); draw(); release(); }
      else simulation.on('end.hold', () => { simulation.on('end.hold', null); release(); }).alpha(.35).restart();
    };
    // Clicking a card selects and opens it; clicking it again folds it.
    const activate = (i: number, toggle = true) => {
      const isOpen = cards[i].classList.contains('is-open');
      const current = selection.current();
      if (current?.node === i && toggle) open([i], !isOpen);
      else if (!isOpen) open([i], true);
      selection.showNode(i, current?.node === i ? current.mode : 'direct');
      if (cards[i].classList.contains('is-open')) camera.reveal(nodes[i]);
    };

    viewport.addEventListener('click', (event) => {
      const target = event.target as Element;
      if (gestures.takeSuppressedClick()) {
        event.preventDefault();
        return;
      }
      if (target.closest('.tg-node__title a')) return;
      const chip = target.closest<HTMLElement>('.tg-proof');
      const card = target.closest<HTMLElement>('.tg-node');
      if (chip) {
        event.preventDefault();
        selection.showEdge(Number(chip.dataset.edge));
      } else if (card) activate(Number(card.dataset.node));
      else selection.clear();
    });
    viewport.addEventListener('dblclick', (event) => {
      const card = (event.target as Element).closest('.tg-node');
      if (card) location.href = card.querySelector('a')!.href;
    });
    viewport.addEventListener('keydown', (event) => {
      const card = (event.target as Element).closest<HTMLElement>('.tg-node');
      if (card && event.target === card && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        activate(Number(card.dataset.node));
      }
    });
    viewport.addEventListener('focusin', (event) => {
      const item = items.find((candidate) => candidate.el.contains(event.target as Node));
      if (item) camera.reveal(item);
    });
    this.addEventListener('keydown', (event) => { if (event.key === 'Escape' && selection.current()) selection.clear(); });

    panel.addEventListener('click', (event) => {
      const button = (event.target as Element).closest<HTMLElement>('button');
      if (!button) return;
      const current = selection.current();
      if (button.dataset.selectNode) {
        const i = Number(button.dataset.selectNode);
        activate(i, false);
        camera.reveal(nodes[i]);
      } else if (button.dataset.selectEdge) {
        const i = Number(button.dataset.selectEdge);
        selection.showEdge(i);
        camera.reveal(proofs[i]);
      } else if (button.dataset.mode && current?.node !== undefined) selection.showNode(current.node, button.dataset.mode as Mode);
      else if (button.dataset.action === 'clear') selection.clear();
    });

    const fullscreen = this.querySelector<HTMLButtonElement>('[data-action="fullscreen"]')!;
    if (!this.requestFullscreen) fullscreen.hidden = true;
    document.addEventListener('fullscreenchange', () => {
      fullscreen.textContent = document.fullscreenElement === this ? 'Exit full screen' : 'Full screen';
      requestAnimationFrame(() => camera.fit(items, true));
    });
    this.querySelector('.theorem-graph__toolbar')!.addEventListener('click', (event) => {
      const action = (event.target as Element).closest<HTMLElement>('[data-action]')?.dataset.action;
      const middle = () => [viewport.clientWidth / 2, viewport.clientHeight / 2] as const;
      if (action === 'zoom-in') { camera.glide(); camera.zoomAt(1.3, ...middle()); }
      else if (action === 'zoom-out') { camera.glide(); camera.zoomAt(1 / 1.3, ...middle()); }
      else if (action === 'fit') camera.fit(items, true);
      else if (action === 'statements') open(cards.map((_, i) => i), statements.getAttribute('aria-pressed') !== 'true');
      else if (action === 'relayout') {
        simulation.on('end.fit', () => { simulation.on('end.fit', null); camera.fit(items, true); });
        layout(true);
      }
      else if (action === 'fullscreen') {
        if (document.fullscreenElement === this) void document.exitFullscreen();
        else void this.requestFullscreen();
      }
    });
  }
}

customElements.define('theorem-graph', TheoremGraph);
