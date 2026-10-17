import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    // Keep existing case, underscores and repeated directory/basename segments.
    loader: docsLoader({ generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, '') }),
    schema: docsSchema(),
  }),
};
