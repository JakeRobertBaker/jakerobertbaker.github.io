import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';
import { copyFile } from 'node:fs/promises';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import remarkDirective from 'remark-directive';
import rehypeKatex from 'rehype-katex';
import mathBlocks, { failMathErrors } from './src/lib/math-blocks.mjs';
import headingLabels from './src/lib/heading-labels.mjs';

// Read on each config reload instead of retaining Node's cached JSON import.
const navigationFile = new URL('./src/data/navigation.json', import.meta.url);
const navigation = JSON.parse(readFileSync(navigationFile, 'utf8'));

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
      rehypePlugins: [[rehypeKatex, { strict: (code) => code === 'newLineInDisplayMode' ? 'ignore' : 'warn', trust: false }], failMathErrors, headingLabels],
    }),
  },
  integrations: [{
    name: 'watch-navigation',
    hooks: {
      'astro:config:setup': ({ addWatchFile }) => addWatchFile(navigationFile),
    },
  }, starlight({
    title: 'Jake Notes',
    description: 'Personal notes on mathematics, deep learning, and related topics.',
    sidebar: navigation,
    routeMiddleware: './src/route-data.ts',
    customCss: [
      'katex/dist/katex.min.css', './src/styles/notes.css',
      './src/styles/book.css', './src/styles/navigation.css',
    ],
    components: {
      Footer: './src/components/Footer.astro',
      PageFrame: './src/components/PageFrame.astro',
      MobileMenuToggle: './src/components/MobileMenuToggle.astro',
    },
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
