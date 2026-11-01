import { getCollection, render } from 'astro:content';
import { createRegistry } from './math-blocks.mjs';

export interface Block {
  id: string; kind: string; title: string; statement: string; source: string; line: number;
  url: string; proves: string | null; uses: string[]; titleHtml?: string; html?: string;
}

// Shared by /theorems.json and graphs: per-page render metadata, aggregated once.
export async function loadRegistry(): Promise<{ version: number; blocks: Block[] }> {
  const entries = await getCollection('docs');
  const pages = await Promise.all(entries.map(async (entry) => {
    const { remarkPluginFrontmatter } = await render(entry);
    return { blocks: remarkPluginFrontmatter.mathBlocks ?? [] };
  }));
  return createRegistry(pages);
}
