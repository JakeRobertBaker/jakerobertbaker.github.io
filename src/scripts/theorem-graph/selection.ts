// Selection highlights a result's proofs, or what it depends on or implies,
// and describes the selection in the side panel.
import type { Edge } from './layout';

export type Mode = 'direct' | 'upstream' | 'downstream';
interface Parts { host: HTMLElement; panel: HTMLElement; cards: HTMLElement[]; chips: HTMLElement[]; edges: Edge[]; groups: SVGGElement[] }

const modes: Record<Mode, [string, string]> = {
  direct: ['Direct', 'Proofs into and out of this result.'],
  upstream: ['All upstream', 'Everything this could rest on, following proofs backwards. Alternative proofs are all included.'],
  downstream: ['All downstream', 'Everything this helps to prove, following proofs forwards.'],
};
const html = (el: Element | null | undefined) => el?.innerHTML ?? '';
const list = (heading: string, hint: string, buttons: string[]) => buttons.length
  ? `<h4>${heading}</h4><p class="tg-panel__hint">${hint}</p><div class="tg-panel__list">${buttons.join('')}</div>` : '';
const close = '<button type="button" class="tg-panel__close" data-action="clear" aria-label="Close">×</button>';

export function createSelection({ host, panel, cards, chips, edges, groups }: Parts) {
  let selected: { node?: number; edge?: number; mode: Mode } | null = null;
  const titleOf = (i: number) => html(cards[i].querySelector('.tg-node__title a'));
  const nodeButton = (i: number) => `<button type="button" data-select-node="${i}">${titleOf(i)}</button>`;
  const edgeButton = (i: number) => `<button type="button" data-select-edge="${i}">${html(chips[i].querySelector('.tg-proof__title'))}</button>`;

  const highlight = () => {
    const litNodes = new Set<number>(), litEdges = new Set<number>();
    if (selected?.edge !== undefined) {
      const edge = edges[selected.edge];
      litEdges.add(selected.edge);
      [...edge.from, edge.to].forEach((i) => litNodes.add(i));
    } else if (selected?.node !== undefined) {
      litNodes.add(selected.node);
      const { mode } = selected;
      // Direct takes one step either way; up- and downstream follow proofs
      // backwards or forwards until nothing new is reached.
      for (let changed = true; changed;) {
        changed = false;
        edges.forEach((edge, i) => {
          if (litEdges.has(i)) return;
          const into = litNodes.has(edge.to) && (mode === 'upstream' || (mode === 'direct' && edge.to === selected!.node));
          const out = edge.from.some((n) => litNodes.has(n)) && (mode === 'downstream' || (mode === 'direct' && edge.from.includes(selected!.node!)));
          if (!into && !out) return;
          litEdges.add(i);
          for (const n of into ? edge.from : [edge.to]) if (!litNodes.has(n)) { litNodes.add(n); changed = mode !== 'direct'; }
        });
      }
    }
    host.classList.toggle('has-selection', !!selected);
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

  const showNode = (i: number, mode: Mode = 'direct') => {
    selected = { node: i, mode };
    const card = cards[i];
    const proved = edges.flatMap((edge, n) => edge.to === i ? [n] : []);
    const used = edges.flatMap((edge, n) => edge.from.includes(i) ? [n] : []);
    panel.innerHTML = `${close}<p class="tg-panel__kind">${html(card.querySelector('.tg-node__kind'))}</p><h3>${titleOf(i)}</h3>`
      + list('← Proved by', 'Proofs of this result, from other results.', proved.map(edgeButton))
      + list('Used in →', 'Proofs that use this result.', used.map(edgeButton))
      + `<h4>Highlight</h4><div class="tg-panel__modes" role="group" aria-label="Highlight">${Object.entries(modes).map(([value, [text]]) =>
        `<button type="button" data-mode="${value}" aria-pressed="${value === mode}">${text}</button>`).join('')}</div>`
      + `<p class="tg-panel__hint">${modes[mode][1]}</p>`
      + `<a class="tg-panel__open" href="${card.querySelector('a')!.getAttribute('href')}">Open in notes →</a>`;
    panel.hidden = false;
    highlight();
  };
  const showEdge = (i: number) => {
    selected = { edge: i, mode: 'direct' };
    const chip = chips[i];
    panel.innerHTML = `${close}<p class="tg-panel__kind">Proof</p><h3>${html(chip.querySelector('.tg-proof__title'))}</h3>`
      + list('Uses', 'The results this proof starts from.', edges[i].from.map(nodeButton))
      + list('Proves', 'The result it establishes.', [nodeButton(edges[i].to)])
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
  return { current: () => selected, showNode, showEdge, clear };
}
