import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';

export const collections = {
  docs: defineCollection({
    // Keep existing case, underscores and repeated directory/basename segments.
    loader: docsLoader({ generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, '') }),
    // `numbering: true` auto-numbers the page's blocks; see instructions/example_template.md.
    schema: docsSchema({ extend: z.object({ numbering: z.boolean().optional() }) }),
  }),
};
