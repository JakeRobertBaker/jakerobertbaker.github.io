# Jake Notes — Astro + Starlight

Markdown mathematics notes, build-time KaTeX, and a small semantic theorem layer. This migration lives on `migration/astro-starlight`; **production is still the existing MkDocs site**. The framework and authoring direction are approved, but publishing the replacement is not.

## Development

Use Node **22.22+** (`.node-version` records the tested version):

```bash
npm ci
npm run dev
```

The native Astro dev server binds `0.0.0.0:2718`, with automatic Markdown, CSS, and component refresh. Open **http://192.168.178.20:2718/** from this LAN or `http://127.0.0.1:2718/` on the host. The user authorized stopping Quartz and reusing 2718; no firewall rules were changed. Check listeners before starting another server on that port.

Astro 7 may run its development server in the background when invoked non-interactively. Use its native controls:

```bash
npm run dev -- status
npm run dev -- logs --follow
npm run dev -- stop
```

After changing Markdown pipeline/plugin code, restart with `npm run dev -- --force` to invalidate Astro's rendered content metadata cache. Normal Markdown, CSS and Astro component edits update automatically. `npm run build` deliberately uses Astro's native `--force` flag so production artifacts never reuse stale imported-plugin metadata.

### Production-build preview and search

Starlight's native Pagefind search is generated during the build. The dev server displays its standard search notice; it does not live-reindex search. To review the full built site on the same LAN port:

```bash
npm run dev -- stop
npm run build
npm run preview
```

Stop that preview before restarting `npm run dev`. For simultaneous local testing, use `npx astro preview --host 127.0.0.1 --port 4322`; browser tests use this loopback port. This is a static artifact preview, not the live-edit server.

## Writing and architecture

Read [the writing conventions](instructions/example_template.md) for mathematical blocks, proof dependencies and cross-references. Notes stay `.md`; use `.mdx` only when a page needs imported interactive components. React is not installed or required.

```text
src/content/docs/        Markdown/optional MDX notes, with title frontmatter
src/content.config.ts   Starlight collection; preserves case/underscores in URLs
src/data/navigation.json Editorial sidebar groups, labels and ordering
src/lib/math-blocks.mjs  Semantic directives, stable heading IDs and registry validation
src/lib/references.mjs   Shared source-relative link/dependency resolver
src/pages/theorems.json.ts Generated, renderer-independent theorem registry
src/components/         Small native Starlight overrides (currently Footer)
src/scripts/            Hover/focus previews and deep-link proof disclosure
src/styles/notes.css    Scoped math-block and responsive math styling
public/                 Static assets, robots.txt, llms.txt, favicon, .nojekyll
astro.config.mjs        Static site, Starlight and the Unified Markdown pipeline
```

Astro 7 defaults to Sätteri; this project explicitly selects its supported **Unified** processor for `remark-math`, `remark-directive`, and `rehype-katex`. KaTeX HTML/MathML, CSS and fonts are built/bundled locally. Mathematical content and native proof disclosure remain usable without JavaScript. Avoid adding client-side math rendering to ordinary notes.

Semantic blocks provide per-file metadata through Astro's render pipeline. `/theorems.json` aggregates those records without a global mutable registry, HTML scraping, a second Markdown parser, or a separate file-watching daemon. Explicit relationships are validated. **No interactive graph is implemented**; a future renderer can consume the versioned registry. Original proofs have not been assigned speculative dependency metadata.

Normal links work without previews. A small vanilla module enhances theorem links on hover/keyboard focus and opens ancestor proofs when following a deep link. Existing headings and block IDs are preserved; do not derive referenced theorem IDs from titles or numbering.

## Validation

```bash
npm run check
npm run test:math
npm run build
npx playwright install chromium
npm run test:preview
npm run test:site
npm audit
```

The site suite in `tests/site/` checks all 25 original URLs, all 250 original content anchors, unchanged body LaTeX hashes, images and local links, proof states/nesting, theorem previews, mobile overflow, navigation, built-site search, the registry and mathematics without JavaScript. `tests/fixtures/legacy-site.json` is an immutable migration baseline captured from MkDocs; never update it just to make a regression pass.

See [browser preview instructions](instructions/site-preview.md) for Pi's official Playwright MCP, trust/reload, SSH/LAN access, screenshots and visual review. No browser-control network port or GUI is required. MCP artifacts belong in `/tmp`, never in published content.

The lockfile pins a tested dependency set. `package.json` temporarily overrides transitive KaTeX to the directly pinned patched version and `postcss-selector-parser` to 7.1.6, resolving advisories in upstream math/Expressive Code dependency ranges. Keep these overrides until upstream ranges include patched releases; test builds and `npm audit` when changing them. The current audit is clean. A single legacy KaTeX strictness warning (`newLineInDisplayMode`) is tolerated without altering source mathematics; actual parse failures fail the build.

## Deployment safety

**Do not deploy this migration yet.** `.github/workflows/validate.yml` builds/tests migration pushes and pull requests with read-only permissions and no publishing job. The original `ci.yml` is unchanged: production continues to build MkDocs from `main` and publish `gh-pages`.

Before the user approves switching, do not merge the migration to `main`, run a manual deploy, push to `gh-pages`, or change GitHub Pages settings. After approval, the production workflow must be changed to build Astro and publish `dist/` (including `.nojekyll`) to the existing `gh-pages` branch. The old MkDocs publishing workflow is not a usable Astro deploy configuration and must not be left in place at cutover.

Canonical URLs, verification metadata, crawler policy and social links are retained. Starlight generates `sitemap-index.xml`/`sitemap-0.xml`; see the migration record for compatibility handling of the old `sitemap.xml`. `public/llms.txt` is the curated published-content guide and must track added/removed notes.

See [the migration record](instructions/framework-migration-proposal.md) for the decision, preservation targets and acceptance status.
