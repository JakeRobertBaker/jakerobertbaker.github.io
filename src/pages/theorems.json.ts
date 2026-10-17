import type { APIRoute } from 'astro';
import { getCollection, render } from 'astro:content';
import { createRegistry } from '../lib/math-blocks.mjs';

export const GET: APIRoute = async () => {
  const entries = await getCollection('docs');
  const pages = await Promise.all(entries.map(async (entry) => {
    const { remarkPluginFrontmatter } = await render(entry);
    return { blocks: remarkPluginFrontmatter.mathBlocks ?? [] };
  }));
  return new Response(JSON.stringify(createRegistry(pages)), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
