// Force layout: results and proof labels are bodies; collisions use their boxes.
// The build picks the layout (bestLayout); the browser only refines it (createSimulation).
import { forceLink, forceManyBody, forceSimulation, forceX, forceY, type SimulationNodeDatum } from 'd3-force';

export interface Edge { from: number[]; to: number }
export interface Box extends SimulationNodeDatum { w: number; h: number; card: boolean }
export interface Item extends Box { el: HTMLElement }
type Segment = { source: Box; target: Box };

// Rectangle collision: push overlapping boxes apart along the shallower axis.
function forceRectangles(padding: number) {
  let items: Box[] = [];
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
  force.initialize = (nodes: Box[]) => { items = nodes; };
  return force;
}

// Hold each proof label near the centre of the results it joins, so its
// curve runs between them rather than around a neighbouring card.
function forceMidpoints(edges: Edge[], nodes: Box[], proofs: Box[], strength: number) {
  return (alpha: number) => edges.forEach((edge, i) => {
    const ends = [...edge.from, edge.to].map((n) => nodes[n]);
    const x = ends.reduce((sum, item) => sum + item.x!, 0) / ends.length;
    const y = ends.reduce((sum, item) => sum + item.y!, 0) / ends.length;
    proofs[i].vx! += (x - proofs[i].x!) * strength * alpha;
    proofs[i].vy! += (y - proofs[i].y!) * strength * alpha;
  });
}

export function createSimulation<T extends Box>(nodes: T[], proofs: T[], edges: Edge[]) {
  // Each proof is a small body between its premises and its result, so
  // parallel and opposite proofs repel into separate, labelled curves.
  const links: Segment[] = edges.flatMap((edge, i) => [
    ...edge.from.map((from) => ({ source: nodes[from], target: proofs[i] })),
    { source: proofs[i], target: nodes[edge.to] },
  ]);
  const radius = (item: Box) => Math.hypot(item.w, item.h) / 2;
  const linkForce = forceLink(links).distance((link) => (radius(link.source as Box) + radius(link.target as Box)) * .7 + 40).strength(.6);
  const simulation = forceSimulation<T>([...nodes, ...proofs])
    .force('link', linkForce)
    .force('charge', forceManyBody<T>().strength((item) => item.card ? -2200 : -250).distanceMax(2000))
    .force('x', forceX(0).strength(.04))
    .force('y', forceY(0).strength(.04))
    .force('midpoint', forceMidpoints(edges, nodes, proofs, .5))
    .force('collide', forceRectangles(18))
    .stop();
  return { simulation, linkForce, links };
}

// What makes a drawing hard to read: arrows crossing, and arrows passing through boxes.
const turn = (o: Box, a: Box, b: Box) => (a.x! - o.x!) * (b.y! - o.y!) - (a.y! - o.y!) * (b.x! - o.x!);
function through({ source: p, target: q }: Segment, box: Box) {
  let t0 = 0, t1 = 1; // clip the segment to the box, one axis at a time
  for (const [start, delta, lo, hi] of [[p.x!, q.x! - p.x!, box.x! - box.w / 2, box.x! + box.w / 2],
    [p.y!, q.y! - p.y!, box.y! - box.h / 2, box.y! + box.h / 2]]) {
    if (!delta) { if (start < lo || start > hi) return false; continue; }
    const [a, b] = [(lo - start) / delta, (hi - start) / delta].sort((m, n) => m - n);
    [t0, t1] = [Math.max(t0, a), Math.min(t1, b)];
    if (t0 > t1) return false;
  }
  return true;
}
function clutter(items: Box[], segments: Segment[]) {
  let count = 0;
  for (const [i, s] of segments.entries()) {
    const ends = [s.source, s.target];
    for (const t of segments.slice(i + 1))
      if (!ends.includes(t.source) && !ends.includes(t.target)
        && turn(s.source, s.target, t.source) * turn(s.source, s.target, t.target) < 0
        && turn(t.source, t.target, s.source) * turn(t.source, t.target, s.target) < 0) count++;
    for (const item of items) if (!ends.includes(item) && through(s, item)) count++;
  }
  return count;
}

const layouts = new Map<string, number[][]>();

/**
 * Build time: centres (cards, then proof labels) of the least cluttered layout found.
 * A force layout settles near wherever it starts, so this tries d3's default start and
 * seeded random ones (fewer for larger graphs), and keeps the best. Deterministic, and
 * cached by graph shape so the dev server recomputes only when the graph changes.
 */
export function bestLayout(nodeSizes: Box[], proofSizes: Box[], edges: Edge[]) {
  const key = JSON.stringify([nodeSizes, proofSizes, edges]);
  if (layouts.has(key)) return layouts.get(key)!;
  const copy = (boxes: Box[]) => boxes.map(({ w, h, card }): Box => ({ w, h, card }));
  const nodes = copy(nodeSizes), proofs = copy(proofSizes), items = [...nodes, ...proofs];
  const { simulation, links } = createSimulation(nodes, proofs, edges);
  const ticks = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay()));
  const tries = Math.min(100, Math.ceil(2000 / items.length)), spread = 300 * Math.sqrt(items.length);
  let seed = 1, best: number[][] = [], fewest = Infinity;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647 - .5;
  for (let attempt = 0; attempt < tries && fewest; attempt++) {
    for (const item of items) {
      [item.x, item.y] = attempt ? [random() * spread, random() * spread] : [undefined, undefined];
      item.vx = item.vy = 0;
    }
    simulation.nodes(items).alpha(1).tick(ticks);
    const score = clutter(items, links);
    if (score < fewest) [fewest, best] = [score, items.map((item) => [Math.round(item.x!), Math.round(item.y!)])];
  }
  layouts.set(key, best);
  return best;
}
