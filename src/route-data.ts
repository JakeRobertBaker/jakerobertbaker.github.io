import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { render } from 'astro:content';

// Use supported route-data customization, leaving both native TOC components
// and their current-section/keyboard behaviour intact. render() reads Astro's
// cached Markdown result, not another parser or a browser DOM transformation.
export const onRequest = defineRouteMiddleware(async ({ locals }) => {
  const { entry, toc } = locals.starlightRoute;
  if (!toc) return;
  const { remarkPluginFrontmatter } = await render(entry);
  const labels = remarkPluginFrontmatter.mathHeadingLabels as Record<string, string> | undefined;
  if (!labels) return;
  const update = (items: typeof toc.items) => {
    for (const item of items) {
      if (Object.hasOwn(labels, item.slug)) item.text = labels[item.slug];
      update(item.children);
    }
  };
  update(toc.items);
});
