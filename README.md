# Jake Notes — Astro + Starlight

Personal mathematics and deep-learning notes built with Astro + Starlight and build-time KaTeX. Live site: **https://jakerobertbaker.github.io/**.

## Development

### Install and edit — `npm ci`, `npm run dev`

Use Node **22.22+** (`.node-version` records the tested version):

```bash
npm ci
npm run dev
```

`npm ci` installs the lockfile's dependencies. `npm run dev` starts the live-edit server at **http://127.0.0.1:2718/**; Markdown, CSS and components reload automatically. Check existing listeners before starting a server; use `npm run dev -- --port 4321` to choose another port.

Dev and preview currently bind to **all network interfaces**. For local-only access, use `npm run dev -- --host 127.0.0.1` or `npm run preview -- --host 127.0.0.1`. Do not expose them to untrusted networks. See [preview access](instructions/site-preview.md#preview-access) for SSH/LAN access.

Astro 7 can background servers in agent sessions. Use its native controls:

```bash
npm run dev -- status
npm run dev -- logs --follow
npm run dev -- stop
```

After changing Markdown plugins, restart dev with `npm run dev -- --force` to clear cached render metadata. Ordinary note edits do not need this.

### Build and preview — `npm run build`, `npm run preview`

`build` produces a fresh static site in `dist/`; `preview` serves that output without live editing. Starlight's Pagefind search is generated at build time, so the dev server's search notice is expected. To inspect the built site:

```bash
npm run dev -- stop  # Only if this checkout owns the running server
npm run build
npm run preview
```

Stop preview before restarting dev: Ctrl-C for a foreground server, `npx astro preview stop` for a background server. To run a separate foreground preview, use `npx astro preview --ignore-lock --host 127.0.0.1 --port 4322`. Browser tests manage their own preview on that port.

## Workflow

- **Ordinary notes, assets, editorial navigation and small docs changes:** preview affected pages and run `npm run check`. These may go directly on `main`; check CI after pushing. A local full build/browser suite is optional; CI runs it before publishing.
- **Infrastructure, rendering, dependencies, broad refactors, URL changes or experiments:** use a branch/PR, run full validation locally, and merge with green CI.

See [Writing mathematical notes](instructions/example_template.md) for page setup, links, math and semantic blocks. Keep ordinary notes in `.md`; use `.mdx` only when imported components are needed. React is not installed or required.

## Source map and architecture

### Notes and navigation

`src/content/docs/` holds notes with title frontmatter. `src/data/navigation.json` controls curated sidebar groups, labels and order. `src/content.config.ts` defines the collection and preserves case/underscores in URLs.

### Configuration and mathematics

`astro.config.mjs` configures static output, Starlight and Unified Markdown processing. Unified is selected explicitly because Astro 7 defaults to Sätteri. KaTeX renders local HTML/MathML, CSS and fonts at build time; math and native proof disclosure work without JavaScript.

`src/lib/` handles math blocks, links and mathematical contents labels. `src/pages/theorems.json.ts` aggregates identified blocks from per-page render metadata, without a second parser or process-global extraction cache. Proof dependencies are explicit and optional; ordinary links do not imply them. `src/route-data.ts` supplies contents labels from cached render metadata.

### Interface and theme

`src/components/` and `src/scripts/` hold small native UI overrides, navigation and progressive theorem previews. Prefer Starlight's supported configuration/hooks and scoped overrides rather than vendoring its UI. `src/styles/` and `src/assets/fonts/` hold the book theme and local fonts; see the [theme guide](instructions/book-theme.md).

### Assets and tests

`public/` holds static images, discovery files and the favicon. `tests/` covers Markdown plugins, screenshot tooling and the built site, including its theme.

## Validation

### Everyday check — `npm run check`

Runs Astro/TypeScript diagnostics. It is not a production build or a complete math/link check; preview the changed notes as described in the workflow above.

### Full validation — `npm run validate`

For infrastructure/rendering changes, or full local confidence:

```bash
npx playwright install chromium  # First setup or after a Playwright upgrade
npm run validate
```

This runs type checking, math/plugin tests, a fresh production build, screenshot-tool tests and the full site/theme browser suite. CI runs the same command. Generated files and browser artifacts are not committed.

The site suite discovers current built pages and checks links/assets/fragments, IDs, math, proofs, previews, navigation, mobile layout, search, discovery, registry consistency and no-JavaScript behaviour. It does not freeze note text or require snapshots/inventories for new notes. Keep `tests/site/` tracked and included in checks; root-only build exclusions must not hide it.

### Focused checks

`npm run test:math` runs the Markdown/plugin unit tests. `npm run test:site` runs all built-site browser tests; `npm run test:theme` runs only the theme subset. Both browser commands use existing `dist/`, so build first after changes. `npm run test:preview` tests the screenshot utility itself; [preview instructions](instructions/site-preview.md) explain `npm run screenshots` for visual inspection.

### Dependencies

Dependencies are pinned by the lockfile. When changing them, run full validation and `npm audit`. KaTeX and `postcss-selector-parser` have patched transitive overrides; reassess them when upstream ranges include the fixes. Only KaTeX's `newLineInDisplayMode` strictness warning is ignored; parse errors fail the build.

See [browser preview instructions](instructions/site-preview.md) for interactive inspection and screenshots, and the [theme guide](instructions/book-theme.md) for responsive contracts and visual tests.

## Deployment

Pushing or merging to `main` triggers `.github/workflows/ci.yml`:

1. Reusable, read-only `validate.yml` runs validation and uploads the tested `dist/`, including hidden files such as `.nojekyll`.
2. A separate `main`-only job downloads that artifact, retains published `_astro/` and `pagefind/` assets **without overwriting tested files**, and publishes to `gh-pages`. Only this job has `contents: write`; it runs no project build scripts.
3. GitHub Pages publishes `gh-pages` at `/`.

Feature pushes/PRs validate without publishing. Failed validation leaves the previous live site in place; publication runs are serialized. Obsolete HTML is removed, while branch history and fingerprinted assets are retained for cached clients. Assets accumulate: review storage as needed, but do not casually prune cache-referenced files.

Deploy through CI only: do not edit generated `gh-pages` files or force-push its history. Roll back by reverting the source change through normal validation/deployment.
