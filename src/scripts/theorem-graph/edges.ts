// SVG curves: premises into a proof label, one arrow out to its result.
import type { Edge, Item } from './layout';

type Point = { x: number; y: number };
const svgNS = 'http://www.w3.org/2000/svg';
const fmt = (p: Point) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;

// Point where the ray from a box's centre towards `p` leaves the box.
function border(item: Item, p: Point, gap = 3) {
  const dx = p.x - item.x!, dy = p.y - item.y!;
  const scale = Math.min((item.w / 2 + gap) / Math.abs(dx || 1e-9), (item.h / 2 + gap) / Math.abs(dy || 1e-9), 1);
  return { x: item.x! + dx * scale, y: item.y! + dy * scale };
}
function arrowhead(tip: Point, from: Point) {
  const len = Math.hypot(tip.x - from.x, tip.y - from.y) || 1;
  const ux = (tip.x - from.x) / len, uy = (tip.y - from.y) / len;
  const base = { x: tip.x - ux * 11, y: tip.y - uy * 11 };
  return `M${fmt(tip)}L${fmt({ x: base.x - uy * 4.5, y: base.y + ux * 4.5 })}L${fmt({ x: base.x + uy * 4.5, y: base.y - ux * 4.5 })}Z`;
}

export function createEdges(svg: SVGSVGElement, edges: Edge[], nodes: Item[], proofs: Item[]) {
  const groups = edges.map((edge, i) => {
    const group = document.createElementNS(svgNS, 'g');
    group.classList.add('tg-edge');
    group.dataset.edge = String(i);
    for (let n = 0; n < edge.from.length + 2; n++) group.append(document.createElementNS(svgNS, 'path'));
    group.lastElementChild!.classList.add('tg-arrowhead');
    svg.append(group);
    return group;
  });
  const draw = () => edges.forEach((edge, i) => {
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
    const towards = (from: Point, to: Point, t: number) =>
      ({ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t });
    const tangent = (point: Point, sign: number) => {
      const reach = Math.hypot(point.x - p.x, point.y - p.y) * .4 * sign / along;
      return { x: p.x + ax * reach, y: p.y + ay * reach };
    };
    starts.forEach((start, n) =>
      paths[n].setAttribute('d', `M${fmt(start)}C${fmt(towards(start, p, .4))} ${fmt(tangent(start, -1))} ${fmt(p)}`));
    const approach = towards(end, p, .4);
    paths[starts.length].setAttribute('d', `M${fmt(p)}C${fmt(tangent(end, 1))} ${fmt(approach)} ${fmt(end)}`);
    paths.at(-1)!.setAttribute('d', arrowhead(end, approach));
  });
  return { groups, draw };
}
