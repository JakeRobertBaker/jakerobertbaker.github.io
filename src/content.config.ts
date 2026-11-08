import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';
import { expositionKinds, resultKinds } from './lib/math-blocks.mjs';

export const collections = {
  docs: defineCollection({
    // Keep existing case, underscores and repeated directory/basename segments.
    loader: docsLoader({ generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, '') }),
    // Block numbering and contents entries; see instructions/example_template.md.
    schema: docsSchema({ extend: z.object({
      numbering: z.boolean().optional(),
      bracketColors: z.union([z.boolean(), z.number().int().min(0)]).optional(),
      contentsBlocks: z.union([z.literal('all'), z.array(z.enum([...resultKinds, ...expositionKinds] as [string, ...string[]]))]).optional(),
    }) }),
  }),
};
