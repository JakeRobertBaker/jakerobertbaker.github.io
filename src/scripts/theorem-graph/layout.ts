// Force layout: results and proof labels are bodies; collisions use their boxes.
import { forceLink, forceManyBody, forceSimulation, forceX, forceY, type SimulationNodeDatum } from 'd3-force';

export interface Edge { from: number[]; to: number }
export interface Item extends SimulationNodeDatum { el: HTMLElement; w: number; h: number; card: boolean }

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

export function createSimulation(nodes: Item[], proofs: Item[], edges: Edge[]) {
  // Each proof is a small body between its premises and its result, so
  // parallel and opposite proofs repel into separate, labelled curves.
  const links = edges.flatMap((edge, i) => [
    ...edge.from.map((from) => ({ source: nodes[from], target: proofs[i] })),
    { source: proofs[i], target: nodes[edge.to] },
  ]);
  const radius = (item: Item) => Math.hypot(item.w, item.h) / 2;
  const linkForce = forceLink(links).distance((link) => (radius(link.source as Item) + radius(link.target as Item)) * .7 + 40).strength(.6);
  const simulation = forceSimulation<Item>([...nodes, ...proofs])
    .force('link', linkForce)
    .force('charge', forceManyBody<Item>().strength((item) => item.card ? -2200 : -250).distanceMax(2000))
    .force('x', forceX(0).strength(.04))
    .force('y', forceY(0).strength(.04))
    .force('midpoint', forceMidpoints(edges, nodes, proofs, .5))
    .force('collide', forceRectangles(18))
    .stop();
  return { simulation, linkForce };
}
