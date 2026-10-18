# Jake Notes — Astro + Starlight

Personal mathematics and deep-learning notes built with Astro + Starlight, build-time KaTeX, and a small semantic theorem layer. Live site: **https://jakerobertbaker.github.io/**.

## Development

Use Node **22.22+** (`.node-version` records the tested version):

```bash
npm ci
npm run dev
```

Open **http://127.0.0.1:2718/** on the development machine; Markdown, CSS and components refresh automatically. Check existing listeners before starting a server. Override the default port with `npm run dev -- --port 4321` when needed.

The current dev/preview configuration binds to `0.0.0.0` (all network interfaces). For local-only access or an SSH tunnel, use `npm run dev -- --host 127.0.0.1` (or `npm run preview -- --host 127.0.0.1`). Do not expose a development server to an untrusted network. See [preview access](instructions/site-preview.md#preview-access) for optional SSH/LAN workflows and private local notes.

Astro 7 may run its development server in the background when invoked non-interactively. Use its native controls:

```bash
npm run dev -- status
npm run dev -- logs --follow
npm run dev -- stop
```

After changing Markdown pipeline/plugin code, restart with `npm run dev -- --force` to invalidate rendered content metadata. `npm run build` also forces a fresh render to avoid stale imported-plugin metadata.

### Production-build preview and search

Starlight's native Pagefind search is generated during the build. The dev server displays its standard search notice; it does not live-reindex search. To review the full built site on the same local port:

```bash
npm run dev -- stop
npm run build
npm run preview
```

Stop that preview before restarting `npm run dev` (`npx astro preview stop` for an agent-started background preview, Ctrl-C for foreground). For simultaneous local testing, use `npx astro preview --ignore-lock --host 127.0.0.1 --port 4322`; browser tests use this loopback port. `--ignore-lock` selects a one-off foreground server even when Astro detects Pi, so Playwright can own and clean up its process. This is a static artifact preview, not the live-edit server.

## Workflow

- Routine notes, assets, editorial navigation and small documentation updates may be committed directly to `main`. Preview content and run relevant [checks](#validation) before pushing; check the hosted CI result afterwards.
- Use a branch/PR with green CI before merging for infrastructure, rendering, dependencies, broad refactors, URL changes or experiments. Keep unfinished work off `main`.

## Writing and architecture

Read [the writing conventions](instructions/example_template.md) for the new-page checklist, navigation/discovery updates, legacy anchors and mathematical blocks/references. Ordinary notes stay `.md`; use `.mdx` only for pages needing imported interactive components. React is not installed or required.

```text
src/content/docs/        Markdown/optional MDX notes, with title frontmatter
src/content.config.ts   Starlight collection; preserves case/underscores in URLs
src/data/navigation.json Editorial sidebar groups, labels and ordering
src/lib/math-blocks.mjs  Semantic directives, stable heading IDs and registry validation
src/lib/references.mjs   Shared source-relative link/dependency resolver
src/pages/theorems.json.ts Generated, renderer-independent theorem registry
src/components/         Small native Starlight frame/menu/footer overrides
src/scripts/            Native navigation, theorem previews and deep-link proof disclosure
src/styles/             Book typography/palette, structural math and navigation geometry
src/assets/fonts/       Local ET Book fonts; provenance in the theme guide
src/route-data.ts       Native contents labels from cached Markdown metadata
tests/site/theme/       Production-theme geometry, touch checks and representative captures
public/                 Static assets, robots.txt, llms.txt, favicon, .nojekyll
astro.config.mjs        Static site, Starlight and the Unified Markdown pipeline
```

- Static Astro output with Starlight's native docs UI. Prefer documented sidebar/frontmatter/hooks and small scoped styles/component overrides, not a vendored theme or browser DOM rewrites.
- Explicit **Unified** Markdown processing (`remark-math`, `remark-directive`, `rehype-katex`), rather than Astro 7's default Sätteri processor. KaTeX HTML/MathML, CSS and fonts are built locally; do not add client-side math rendering. Mathematics and native proof disclosure work without JavaScript.
- Semantic blocks supply per-file render metadata from the same Markdown AST. `/theorems.json` aggregates it and validates explicit relationships: no process-global mutable extraction cache, HTML scraping, second source parser or separate watcher. No interactive graph or inferred proof dependencies.
- Small vanilla scripts enhance theorem links with hover/focus previews and deep-link proof disclosure; ordinary links remain usable without them. The book theme reuses Starlight's native navigation/contents components. A post-KaTeX metadata plugin and supported route middleware prevent duplicated mathematical contents labels without changing article headings or IDs.

## Validation

```bash
npm run check
npm run test:math
npm run build
npx playwright install chromium
npm run test:preview
npm run test:site        # Includes the production-theme review/captures
npm audit
```

`tests/site/` checks legacy URLs, anchors and body-LaTeX hashes, links/assets, proof behaviour, theorem previews, mobile layout, navigation, built search, the registry and mathematics without JavaScript. Registry checks preserve original block identities while allowing additions and declared dependencies. `tests/fixtures/legacy-site.json` is the immutable MkDocs baseline; never refresh it merely to pass a regression.

The root `site/` directory may remain from a local MkDocs build; it is ignored by Git and excluded from TypeScript checking, like `dist/`. These root-only exclusions must not hide the tracked `tests/site/` suite.

See [browser preview instructions](instructions/site-preview.md) for Playwright MCP, browser setup, screenshots, remote access and visual review. The [Mathematical Book theme guide](instructions/book-theme.md) documents the production design, source map, responsive navigation contract and focused `npm run test:theme` command. The approved theme is static CSS by default, including without JavaScript; no experiment flags, comparison controls or theme-specific URL/session settings remain.

The lockfile pins tested dependencies. `package.json` overrides transitive KaTeX and `postcss-selector-parser` to patched versions; retain these until upstream ranges include the fixes, and rerun validation and `npm audit` when changing dependencies. Only the legacy KaTeX strictness issue `newLineInDisplayMode` is tolerated; actual parse failures fail the build.

## Deployment

Pushing or merging to `main` triggers `.github/workflows/ci.yml`:

1. It calls the reusable, read-only `validate.yml`: clean install, type checking, math tests, Astro build and browser tests.
2. Validation uploads the **tested** `dist/` artifact, explicitly including hidden files such as `.nojekyll`.
3. A separate `main`-only job downloads that exact artifact, adds previously published `_astro/` and `pagefind/` assets **without overwriting any tested files**, and publishes it to the existing `gh-pages` branch using the commit-pinned `peaceiris/actions-gh-pages` action. Only this job has `contents: write`; it does not run project build scripts.
4. GitHub's branch-based `pages-build-deployment` publishes `gh-pages` to the live site. Pages remains configured for `gh-pages` at `/`; no settings change or personal access token is required.

Failed validation prevents publication, leaving the previous live site in place; fix or revert a failing `main` commit rather than bypassing checks. Publishing runs are serialized. Feature pushes/PRs validate read-only and cannot publish; manual workflow runs remain `main`-only for publication.

Obsolete pages are removed and `gh-pages` history retained. The publisher carries forward assets from its current and preceding commits so cached clients keep working; no old HTML is copied back. Assets accumulate across releases: review storage as needed, but do not casually prune cache-referenced fingerprints.

Do not run `mkdocs gh-deploy`, manually copy builds to `gh-pages`, edit its generated files or force-push its history.

### Cutover and rollback

Tags `pre-astro-source-2026-10-17` and `pre-astro-pages-2026-10-17` preserve the previous source and output. To undo the cutover, review/revert the migration merge through a source PR (`git revert -m 1 <cutover-merge-commit>`), restoring the prior MkDocs source/workflow for automatic republication. Consult the [migration record](instructions/framework-migration-proposal.md) and GitHub run history first; the record also covers preservation targets, legacy sitemap compatibility and acceptance checks.
