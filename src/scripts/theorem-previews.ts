// Progressive enhancement only: normal links, math, and proofs work without JS.
function revealTarget() {
  let target: HTMLElement | null;
  try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); }
  catch { return; }
  if (!target) return;
  for (let node: HTMLElement | null = target; node; node = node.parentElement)
    if (node instanceof HTMLDetailsElement) node.open = true;
  requestAnimationFrame(() => target?.scrollIntoView());
}
revealTarget();
window.addEventListener('hashchange', revealTarget);

const preview = document.createElement('aside');
preview.id = 'theorem-preview';
preview.className = 'sl-markdown-content';
preview.setAttribute('role', 'tooltip');
preview.hidden = true;
document.body.append(preview);
const documents = new Map<string, Promise<Document>>();
let active: HTMLAnchorElement | null = null;
let timer: ReturnType<typeof setTimeout>;
let revision = 0;

function hide() {
  clearTimeout(timer);
  revision++;
  active?.removeAttribute('aria-describedby');
  active = null;
  preview.hidden = true;
}
function deferHide() { clearTimeout(timer); timer = setTimeout(hide, 160); }
async function show(link: HTMLAnchorElement) {
  const url = new URL(link.href);
  if (!url.hash || url.origin !== location.origin || link.classList.contains('math-permalink')) return;
  const current = ++revision;
  clearTimeout(timer);
  try {
    const pathname = url.pathname + url.search;
    let doc: Document = document;
    if (pathname !== location.pathname + location.search) {
      if (!documents.has(pathname)) documents.set(pathname, fetch(pathname)
        .then((response) => { if (!response.ok) throw new Error('Preview unavailable'); return response.text(); })
        .then((html) => new DOMParser().parseFromString(html, 'text/html'))
        .catch((error) => { documents.delete(pathname); throw error; }));
      doc = await documents.get(pathname)!;
    }
    const target = doc.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (current !== revision || !target?.matches('[data-math-kind]')) return;
    const clone = target.cloneNode(true) as HTMLElement;
    // Fetch only same-origin pages, strip executable content and duplicate IDs,
    // and keep nested proofs out of statement previews.
    clone.querySelectorAll('script, style, iframe, object, embed, details[data-math-kind="proof"]').forEach((node) => node.remove());
    for (const element of [clone, ...clone.querySelectorAll('*')]) {
      element.removeAttribute('id');
      for (const attr of [...element.attributes])
        if (attr.name.startsWith('on')) element.removeAttribute(attr.name);
    }
    // URLs in fetched HTML must resolve against the fetched page, not this one.
    clone.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
      anchor.href = new URL(anchor.getAttribute('href')!, url).href;
    });
    clone.querySelectorAll<HTMLImageElement>('img[src]').forEach((image) => {
      image.src = new URL(image.getAttribute('src')!, url).href;
    });
    if (clone instanceof HTMLDetailsElement) clone.open = true;
    active?.removeAttribute('aria-describedby');
    active = link;
    preview.replaceChildren(clone);
    preview.hidden = false;
    link.setAttribute('aria-describedby', preview.id);
    const box = link.getBoundingClientRect();
    const bounds = preview.getBoundingClientRect();
    preview.style.left = `${Math.max(16, Math.min(box.left, innerWidth - bounds.width - 16))}px`;
    preview.style.top = `${Math.max(16, Math.min(box.bottom + 8, innerHeight - bounds.height - 16))}px`;
  } catch { /* Preview is optional; the ordinary link is always usable. */ }
}
function linkFrom(event: Event) {
  return event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('.sl-markdown-content a[href*="#"]') : null;
}
document.addEventListener('pointerover', (event) => {
  if (event.pointerType === 'touch' || preview.contains(event.target as Node)) return;
  const link = linkFrom(event);
  if (!link || link === active) return;
  clearTimeout(timer);
  timer = setTimeout(() => void show(link), 220);
});
document.addEventListener('pointerout', (event) => {
  const link = linkFrom(event);
  if (!link || (event.relatedTarget instanceof Node && link.contains(event.relatedTarget))) return;
  clearTimeout(timer);
  if (!(event.relatedTarget instanceof Node && preview.contains(event.relatedTarget))) deferHide();
});
document.addEventListener('focusin', (event) => {
  const link = linkFrom(event);
  if (link && !preview.contains(link)) void show(link);
});
document.addEventListener('focusout', (event) => {
  if (!(event.relatedTarget instanceof Node && preview.contains(event.relatedTarget))) deferHide();
});
preview.addEventListener('pointerenter', () => clearTimeout(timer));
preview.addEventListener('pointerleave', deferHide);
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') hide(); });
window.addEventListener('resize', hide);
