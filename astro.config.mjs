import { defineConfig } from 'astro/config';
import { copyFile } from 'node:fs/promises';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import rehypeKatex from 'rehype-katex';
import mathBlocks, { failMathErrors } from './src/lib/math-blocks.mjs';
import navigation from './src/data/navigation.json' with { type: 'json' };

export default defineConfig({
  site: 'https://jakerobertbaker.github.io',
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'always',
  server: { host: '0.0.0.0', port: 2718 },
  vite: { server: { strictPort: true } },
  markdown: {
    processor: unified({
      smartypants: false,
      remarkPlugins: [remarkMath, remarkDirective, mathBlocks],
      rehypePlugins: [[rehypeKatex, { strict: (code) => code === 'newLineInDisplayMode' ? 'ignore' : 'warn', trust: false }], failMathErrors],
    }),
  },
  integrations: [starlight({
    title: 'Jake Notes',
    description: 'Personal notes on mathematics, deep learning, and related topics.',
    sidebar: navigation,
    customCss: ['katex/dist/katex.min.css', './src/styles/notes.css'],
    components: { Footer: './src/components/Footer.astro' },
    social: [
      { icon: 'github', label: 'GitHub', href: 'https://github.com/jakerobertbaker' },
      { icon: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/jake-robert-baker' },
    ],
    head: [{ tag: 'meta', attrs: {
      name: 'google-site-verification', content: 'gEOmW-qgr_yKbiRv9hNzVzRaIHlBm7kxsZTmr8coNRI',
    } }],
  }), {
    name: 'legacy-sitemap-url',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        await copyFile(new URL('sitemap-index.xml', dir), new URL('sitemap.xml', dir));
      },
    },
  }],
});
