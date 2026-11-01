// Progressive enhancement for <theorem-graph>: the server renders cards and
// proofs as a list; this lays them out with d3-force on a pan/zoom canvas.
import { forceLink, forceManyBody, forceSimulation, forceX, forceY, type SimulationNodeDatum } from 'd3-force';

interface Edge { from: number[]; to: number }
interface Item extends SimulationNodeDatum { el: HTMLElement; w: number; h: number; card: boolean }
type Mode = 'neighbours' | 'ancestors' | 'descendants';

const svgNS = 'http://www.w3.org/2000/svg';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// Rectangle collision: push overlapping boxes apart along the shallower axis.
function forceRectangles(padding: number) {
  let items: Item[] = [];
  const force = () => {
    for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
      const a = items[i], b = items[j];
      let dx = b.x! + b.vx! - a.x! - a.vx!, dy = b.y! + b.vy! - a.y! - a.vy!;
      const ox = (a.w + b.w) / 2 + padding - Math.abs(dx), oy = (a.h + b.h) / 2 + padding - Math.abs(dy);
      if (ox <= 0 || oy <= 0) continue;
      if (!dx && !dy) dx = (j - i) * 1e-3;
      // A dragged (fixed) item does not move; the other takes the whole push.
      const share = a.fx != null ? [0, 1] : b.fx != null ? [1, 0] : [.5, .5];
      if (ox < oy) { const push = Math.sign(dx) * ox * .6; a.vx! -= push * share[0]; b.vx! += push * share[1]; }
      else { const push = Math.sign(dy || 1) * oy * .6; a.vy! -= push * share[0]; b.vy! += push * share[1]; }
    }
  };
  force.initialize = (nodes: Item[]) => { items = nodes; };
  return force;
}

// Hold each proof label near the centre of the results it joins, so its
// curve runs between them rather than around a neighbouring card.
function forceMidpoints(edges: Edge[], nodes: Item[], proofs: Item[], strength: number) {
  return (alpha: number) => edges.forEach((edge, i) => {
    const ends = [...edge.from, edge.to].map((n) => nodes[n]);
    const x = ends.reduce((sum, item) => sum + item.x!, 0) / ends.length;
    const y = ends.reduce((sum, item) => sum + item.y!, 0) / ends.length;
    proofs[i].vx! += (x - proofs[i].x!) * strength * alpha;
    proofs[i].vy! += (y - proofs[i].y!) * strength * alpha;
  });
}

// Point where the ray from a box's centre towards `p` leaves the box.
function border(item: Item, p: { x: number; y: number }, gap = 3) {
  const dx = p.x - item.x!, dy = p.y - item.y!;
  const scale = Math.min((item.w / 2 + gap) / Math.abs(dx || 1e-9), (item.h / 2 + gap) / Math.abs(dy || 1e-9), 1);
  return { x: item.x! + dx * scale, y: item.y! + dy * scale };
}
const fmt = (p: { x: number; y: number }) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
function arrowhead(tip: { x: number; y: number }, from: { x: number; y: number }) {
  const len = Math.hypot(tip.x - from.x, tip.y - from.y) || 1;
  const ux = (tip.x - from.x) / len, uy = (tip.y - from.y) / len;
  const base = { x: tip.x - ux * 11, y: tip.y - uy * 11 };
  return `M${fmt(tip)}L${fmt({ x: base.x - uy * 4.5, y: base.y + ux * 4.5 })}L${fmt({ x: base.x + uy * 4.5, y: base.y - ux * 4.5 })}Z`;
}

class TheoremGraph extends HTMLElement {
  private view = { x: 0, y: 0, k: 1 };
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
    // Each proof is a small body between its premises and its result, so
    // parallel and opposite proofs repel into separate, labelled curves.
    const links = edges.flatMap((edge, i) => [
      ...edge.from.map((from) => ({ source: nodes[from], target: proofs[i] })),
      { source: proofs[i], target: nodes[edge.to] },
    ]);
    const radius = (item: Item) => Math.hypot(item.w, item.h) / 2;
    const simulation = forceSimulation<Item>(items)
      .force('link', forceLink(links).distance((link) => (radius(link.source as Item) + radius(link.target as Item)) * .7 + 40).strength(.6))
      .force('charge', forceManyBody<Item>().strength((item) => item.card ? -2200 : -250).distanceMax(2000))
      .force('x', forceX(0).strength(.04))
      .force('y', forceY(0).strength(.04))
      .force('midpoint', forceMidpoints(edges, nodes, proofs, .5))
      .force('collide', forceRectangles(18))
      .stop();

    const groups = edges.map((edge, i) => {
      const group = document.createElementNS(svgNS, 'g');
      group.classList.add('tg-edge');
      group.dataset.edge = String(i);
      for (let n = 0; n < edge.from.length + 2; n++) group.append(document.createElementNS(svgNS, 'path'));
      group.lastElementChild!.classList.add('tg-arrowhead');
      svg.append(group);
      return group;
    });

    const draw = () => {
      // Centre-anchored, so labels enlarged at far zoom stay on their curves.
      for (const item of items)
        item.el.style.transform = `translate(${item.x!.toFixed(1)}px, ${item.y!.toFixed(1)}px) translate(-50%, -50%)`;
      edges.forEach((edge, i) => {
        const proof = proofs[i], target = nodes[edge.to];
        const paths = [...groups[i].children] as SVGPathElement[];
        // Premises curve into the proof label and one arrow curves out of it,
        // all tangent there to the overall direction of the proof. A label on
        // the straight path between two cards therefore gives a straight arrow.
        const p = { x: proof.x!, y: proof.y! };
        const starts = edge.from.map((from) => border(nodes[from], p));
        const end = border(target, p);
        const ax = end.x - starts.reduce((sum, start) => sum + start.x, 0) / starts.length;
        const ay = end.y - starts.reduce((sum, start) => sum + start.y, 0) / starts.length;
        const along = Math.hypot(ax, ay) || 1;
        const towards = (from: { x: number; y: number }, to: { x: number; y: number }, t: number) =>
          ({ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t });
        const tangent = (point: { x: number; y: number }, sign: number) => {
          const reach = Math.hypot(point.x - p.x, point.y - p.y) * .4 * sign / along;
          return { x: p.x + ax * reach, y: p.y + ay * reach };
        };
        starts.forEach((start, n) =>
          paths[n].setAttribute('d', `M${fmt(start)}C${fmt(towards(start, p, .4))} ${fmt(tangent(start, -1))} ${fmt(p)}`));
        const approach = towards(end, p, .4);
        paths[starts.length].setAttribute('d', `M${fmt(p)}C${fmt(tangent(end, 1))} ${fmt(approach)} ${fmt(end)}`);
        paths.at(-1)!.setAttribute('d', arrowhead(end, approach));
      });
    };

    const apply = () => {
      const { x, y, k } = this.view;
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
    const fit = (subset = items, animate = false) => {
      const { x0, x1, y0, y1 } = bounds(subset);
      const k = Math.min(viewport.clientWidth / (x1 - x0 + 48), viewport.clientHeight / (y1 - y0 + 48), 1.1);
      this.view = { k, x: viewport.clientWidth / 2 - k * (x0 + x1) / 2, y: viewport.clientHeight / 2 - k * (y0 + y1) / 2 };
      if (animate) glide();
      apply();
    };
    const zoomAt = (factor: number, px: number, py: number) => {
      const { x, y, k } = this.view;
      const next = Math.min(2.5, Math.max(.08, k * factor));
      this.view = { k: next, x: px - (px - x) * next / k, y: py - (py - y) * next / k };
      apply();
    };
    const layout = (animate: boolean) => {
      for (const item of items) delete item.x, delete item.y, delete item.vx, delete item.vy, item.fx = item.fy = null;
      simulation.nodes(items).alpha(1);
      if (animate && !reducedMotion.matches) { simulation.restart(); return; }
      simulation.tick(Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())));
      draw();
      fit();
    };
    simulation.on('tick', draw);
    layout(false);

    // Selection highlights a result's proofs, or what it depends on or implies.
    let selected: { node?: number; edge?: number; mode: Mode } | null = null;
    const html = (el: Element | null | undefined) => el?.innerHTML ?? '';
    const titleOf = (i: number) => html(cards[i].querySelector('.tg-node__title a'));
    const nodeButton = (i: number) => `<button type="button" data-select-node="${i}">${titleOf(i)}</button>`;
    const edgeButton = (i: number) => `<button type="button" data-select-edge="${i}">${html(chips[i].querySelector('.tg-proof__title'))}</button>`;
    const list = (heading: string, buttons: string[]) =>
      buttons.length ? `<h4>${heading}</h4><div class="tg-panel__list">${buttons.join('')}</div>` : '';
    const close = '<button type="button" class="tg-panel__close" data-action="clear" aria-label="Close">×</button>';

    const highlight = () => {
      const litNodes = new Set<number>(), litEdges = new Set<number>();
      if (selected?.edge !== undefined) {
        const edge = edges[selected.edge];
        litEdges.add(selected.edge);
        [...edge.from, edge.to].forEach((i) => litNodes.add(i));
      } else if (selected?.node !== undefined) {
        litNodes.add(selected.node);
        const { mode } = selected;
        // Neighbours take one step either way; the other modes take the closure.
        for (let changed = true; changed;) {
          changed = false;
          edges.forEach((edge, i) => {
            if (litEdges.has(i)) return;
            const into = litNodes.has(edge.to) && (mode === 'ancestors' || (mode === 'neighbours' && edge.to === selected!.node));
            const out = edge.from.some((n) => litNodes.has(n)) && (mode === 'descendants' || (mode === 'neighbours' && edge.from.includes(selected!.node!)));
            if (!into && !out) return;
            litEdges.add(i);
            for (const n of into ? edge.from : [edge.to]) if (!litNodes.has(n)) { litNodes.add(n); changed = mode !== 'neighbours'; }
          });
        }
      }
      this.classList.toggle('has-selection', !!selected);
      cards.forEach((el, i) => {
        el.classList.toggle('is-lit', litNodes.has(i));
        el.classList.toggle('is-selected', selected?.node === i);
      });
      chips.forEach((el, i) => {
        el.classList.toggle('is-lit', litEdges.has(i));
        el.classList.toggle('is-selected', selected?.edge === i);
      });
      groups.forEach((el, i) => el.classList.toggle('is-lit', litEdges.has(i)));
    };

    const showNode = (i: number, mode: Mode = 'neighbours') => {
      selected = { node: i, mode };
      const card = cards[i];
      const proved = edges.flatMap((edge, n) => edge.to === i ? [n] : []);
      const used = edges.flatMap((edge, n) => edge.from.includes(i) ? [n] : []);
      const modes: [Mode, string][] = [['neighbours', 'Neighbours'], ['ancestors', 'Depends on'], ['descendants', 'Consequences']];
      panel.innerHTML = `${close}<h3>${titleOf(i)}</h3>${html(card.querySelector('.tg-node__body'))}`
        + list('Proved by', proved.map(edgeButton)) + list('Used in', used.map(edgeButton))
        + `<div class="tg-panel__modes" role="group" aria-label="Highlight">${modes.map(([value, text]) =>
          `<button type="button" data-mode="${value}" aria-pressed="${value === mode}">${text}</button>`).join('')}</div>`
        + `<a class="tg-panel__open" href="${card.querySelector('a')!.getAttribute('href')}">Open in notes →</a>`;
      panel.hidden = false;
      highlight();
    };
    const showEdge = (i: number) => {
      selected = { edge: i, mode: 'neighbours' };
      const chip = chips[i];
      panel.innerHTML = `${close}<h3>${html(chip.querySelector('.tg-proof__title'))}</h3>`
        + list('Uses', edges[i].from.map(nodeButton)) + list('Proves', [nodeButton(edges[i].to)])
        + `<h4>Proof</h4>${html(chip.parentElement!.querySelector('template'))}`
        + `<a class="tg-panel__open" href="${chip.getAttribute('href')}">Open proof in notes →</a>`;
      panel.hidden = false;
      highlight();
    };
    const clear = () => {
      selected = null;
      panel.hidden = true;
      highlight();
    };
    const reveal = (item: Item) => {
      const { k } = this.view;
      const x = item.x! * k + this.view.x, y = item.y! * k + this.view.y;
      const margin = 40;
      if (x > margin && x < viewport.clientWidth - margin && y > margin && y < viewport.clientHeight - margin) return;
      this.view = { k, x: viewport.clientWidth / 2 - item.x! * k, y: viewport.clientHeight / 3 - item.y! * k };
      glide();
      apply();
    };

    // Pointer gestures: drag a card or proof, pan the background, pinch to zoom.
    // Capture starts only once a gesture moves, so plain clicks reach links.
    const pointers = new Map<number, { x: number; y: number }>();
    let gesture: { id: number; item?: Item; x: number; y: number; moved: boolean } | null = null;
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
        zoomAt(now.distance / pinch.distance, now.x, now.y);
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
        gesture.item.fx! += dx / this.view.k;
        gesture.item.fy! += dy / this.view.k;
      } else {
        this.view.x += dx;
        this.view.y += dy;
        apply();
      }
    });
    const end = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) pinch = null;
      if (gesture?.id === event.pointerId) {
        suppressClick = gesture.moved;
        release();
      }
    };
    viewport.addEventListener('pointerup', end);
    viewport.addEventListener('pointercancel', end);
    viewport.addEventListener('wheel', (event) => {
      event.preventDefault();
      const { x, y } = local(event);
      // Trackpad pinches arrive as ctrl+wheel with small deltas.
      zoomAt(Math.exp(-event.deltaY * (event.ctrlKey ? .01 : .0015)), x, y);
    }, { passive: false });

    viewport.addEventListener('click', (event) => {
      const target = event.target as Element;
      if (suppressClick) {
        suppressClick = false;
        event.preventDefault();
        return;
      }
      if (target.closest('.tg-node__title a')) return;
      const chip = target.closest<HTMLElement>('.tg-proof');
      const card = target.closest<HTMLElement>('.tg-node');
      if (chip) {
        event.preventDefault();
        showEdge(Number(chip.dataset.edge));
      } else if (card) showNode(Number(card.dataset.node));
      else clear();
    });
    viewport.addEventListener('dblclick', (event) => {
      const card = (event.target as Element).closest('.tg-node');
      if (card) location.href = card.querySelector('a')!.href;
    });
    viewport.addEventListener('keydown', (event) => {
      const card = (event.target as Element).closest<HTMLElement>('.tg-node');
      if (card && event.target === card && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        showNode(Number(card.dataset.node));
      }
    });
    viewport.addEventListener('focusin', (event) => {
      const item = items.find((candidate) => candidate.el.contains(event.target as Node));
      if (item) reveal(item);
    });
    this.addEventListener('keydown', (event) => { if (event.key === 'Escape' && selected) clear(); });

    panel.addEventListener('click', (event) => {
      const button = (event.target as Element).closest<HTMLElement>('button');
      if (!button) return;
      if (button.dataset.selectNode) {
        const i = Number(button.dataset.selectNode);
        showNode(i);
        reveal(nodes[i]);
      } else if (button.dataset.selectEdge) {
        const i = Number(button.dataset.selectEdge);
        showEdge(i);
        reveal(proofs[i]);
      } else if (button.dataset.mode && selected?.node !== undefined) showNode(selected.node, button.dataset.mode as Mode);
      else if (button.dataset.action === 'clear') clear();
    });

    const fullscreen = this.querySelector<HTMLButtonElement>('[data-action="fullscreen"]')!;
    if (!this.requestFullscreen) fullscreen.hidden = true;
    document.addEventListener('fullscreenchange', () => {
      fullscreen.textContent = document.fullscreenElement === this ? 'Exit full screen' : 'Full screen';
      requestAnimationFrame(() => fit(items, true));
    });
    this.querySelector('.theorem-graph__toolbar')!.addEventListener('click', (event) => {
      const action = (event.target as Element).closest<HTMLElement>('[data-action]')?.dataset.action;
      const middle = () => [viewport.clientWidth / 2, viewport.clientHeight / 2] as const;
      if (action === 'zoom-in') { glide(); zoomAt(1.3, ...middle()); }
      else if (action === 'zoom-out') { glide(); zoomAt(1 / 1.3, ...middle()); }
      else if (action === 'fit') fit(items, true);
      else if (action === 'relayout') {
        simulation.on('end.fit', () => { simulation.on('end.fit', null); fit(items, true); });
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
