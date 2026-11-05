import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { render } from 'astro:content';

type TocItem = { depth: number; slug: string; text: string; children: TocItem[] };
interface ContentsEntry { id: string; kind: string; sections: string[]; text?: string }

// Use supported route-data customization, leaving both native TOC components
// and their current-section/keyboard behaviour intact. render() reads Astro's
// cached Markdown result, not another parser or a browser DOM transformation.
export const onRequest = defineRouteMiddleware(async ({ locals }) => {
  const { entry, toc } = locals.starlightRoute;
  if (!toc) return;
  const { remarkPluginFrontmatter } = await render(entry);
  const labels = remarkPluginFrontmatter.mathHeadingLabels as Record<string, string> | undefined;
  const bySlug = new Map<string, TocItem>();
  const index = (items: TocItem[]) => {
    for (const item of items) {
      if (labels && Object.hasOwn(labels, item.slug)) item.text = labels[item.slug];
      bySlug.set(item.slug, item);
      index(item.children);
    }
  };
  index(toc.items);

  // Frontmatter `contentsBlocks` lists the block kinds (or `all`) to show
  // under the nearest heading the contents includes, before its subheadings.
  const wanted = entry.data.contentsBlocks;
  if (!wanted) return;
  const entries = (remarkPluginFrontmatter.mathContents ?? []) as ContentsEntry[];
  const added = new Map<TocItem, TocItem[]>();
  for (const block of entries) {
    if (wanted !== 'all' && !wanted.includes(block.kind as never)) continue;
    const parent = [...block.sections].reverse().map((slug) => bySlug.get(slug)).find(Boolean) ?? bySlug.get('_top');
    if (!parent) continue;
    const list = added.get(parent) ?? added.set(parent, []).get(parent)!;
    list.push({ depth: parent.depth + 1, slug: block.id, text: block.text ?? block.id, children: [] });
  }
  for (const [parent, blocks] of added) parent.children.unshift(...blocks);
});
