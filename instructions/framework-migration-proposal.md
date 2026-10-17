# Proposed framework migration

**Status: recommendation awaiting agreement; no website migration or deployment has begun.**

The preview tooling is independently implemented on `tooling/site-preview`. The source of truth for content remains the production MkDocs repository, not the Quartz worktree's modified content. The latter is a useful implementation reference and remains untouched.

## Recommendation

Use **Astro + Starlight**, static output, Markdown by default, and an explicitly configured **Unified** Markdown processor. Render math at build time with `remark-math` and `rehype-katex`; bundle pinned KaTeX CSS/fonts locally. Use ordinary Astro components and small browser modules for future interactive tools; introduce a client framework only if a particular tool warrants one.

At investigation time, npm's stable versions are Astro **7.4.0** and Starlight **0.42.6**. Starlight declares Astro `^7.2.10` and `@astrojs/markdown-remark` `^7.3.0` peers; Astro requires Node **22.22+**. The host's Node 22.23.0 satisfies that. These are observations, not dependencies installed for the migration yet. Pin a tested compatible set and commit its lockfile when implementation begins.

**Important current-version detail:** Astro 7 defaults to Sätteri, not Unified. Explicitly select the supported `@astrojs/markdown-remark` processor to use established remark/rehype packages. This is a documented extension path, not a compiler fork. Do not blindly apply older Astro configuration examples.

| Candidate | Fit for these notes | Main trade-off |
| --- | --- | --- |
| **Astro + Starlight** | Strong documentation baseline, native development reload, build-time math, mature Markdown AST tooling, flexible Astro/MDX components and framework-optional islands. | Node dependencies and a small custom semantic-block transform; default slugging and build-time search need deliberate handling. |
| **Hugo** | Excellent static-site build performance, native live reload, straightforward binary, shortcodes/render hooks. Current Hugo can render KaTeX at build time via `transform.ToMath`; it does not require client-side math. | A theorem registry is possible, but proof/block extraction is less direct than a shared Markdown AST pipeline. Rich reusable tools and a cohesive docs UI require more theme/template decisions and JS integration. No evidence that its build-speed advantage is decisive for this small site. |
| **Quartz 5** | Useful notes-first features, KaTeX, popovers and page graphs. The experiment already demonstrates original block syntax, anchor aliases and legacy URL handling. | Its page graph is not the proposed theorem/proof graph. The experiment needed editorial navigation/title adaptations and a custom LAN-friendly watch server. Its large plugin/core surface is less attractive than Starlight plus a narrowly scoped math layer for this documentation-first site. |
| **Keep Material** | Already provides excellent writing, navigation and reload; cheapest maintenance in the short term. | Viable if the roadmap stays mostly static notes, but a shared theorem AST/registry and reusable interactive components would bridge Python-Markdown and separate browser tooling. Astro is a better fit for the stated long-term direction. |

No comparative build-speed benchmark has been performed; the recommendation is about architecture and feature fit, not claimed measured speed.

## Inspection findings and preservation targets

- **25 Markdown pages**, including one currently outside the hand-written navigation: `mathematics/problems/uniform_fraction.md`. Keep it published.
- **117 `///` blocks**: 55 definitions, 23 theorems, 14 proofs, 13 notes, 9 lemmas, 3 examples; 98 explicit block IDs. Nested blocks and `open: true` proofs occur in real content. Support propositions too, even though none currently occur.
- Math uses `$...$` and multiline `$$` with substantial `align*`/matrix content. Preserve the author's statements and wording. Do not silently fix mathematical or editorial errors as part of mechanical migration.
- URLs use underscores, repeated basenames (`linear_models/linear_models/`), and mixed case (`exercises_2A/`). Preserve these exact canonical paths and directory-style trailing slashes, rather than accepting a framework's default slugification. Prefer documented `slug` frontmatter or `docsLoader({ generateId })` hooks as appropriate; no duplicate pages merely to fix a title.
- Block IDs include underscores and uppercase letters. Preserve exact IDs. Inventory generated **heading** anchors before removing source H1s or changing slug generators; retain aliases where heading IDs differ. Preserve useful aliases discovered in the experiment only where warranted, rather than adopting its changed canonical URLs.
- Preserve the editorial navigation hierarchy/order and labels from `mkdocs.yml`, independently of filenames. Use Starlight's sidebar configuration and frontmatter, not browser-side DOM rewriting.
- Keep images/SVG diagrams, image sizing and dependency-summary content. Existing static theorem dependency illustrations may remain as ordinary content assets; do not preserve their generation machinery as an architectural requirement or add a new graph renderer.
- The home page uses Material-specific grid markup, emoji shortcodes and icons. Recreate its purpose with native Starlight cards/splash presentation or simple semantic markup; do not copy Material templates wholesale.
- `{data-preview}` occurs on cross-page references, but the production source has no custom hover-preview handler configured. Treat previews as a behavior to validate/improve, not something to assume is currently working. Implement focused same-origin theorem previews for pointer hover and keyboard focus, without making links depend on JavaScript.
- Keep titles/descriptions, Google verification, canonical URLs, `robots.txt`, `llms.txt`, sitemap, and social links. The curated `llms.txt` already omits a few newer pages: reconcile it with the final published inventory during migration.
- Deployment currently runs only on pushes to `main`, builds MkDocs, and pushes `gh-pages`. Do not change production settings, push a deployment, or run a manual deploy before approval.

## Proposed authoring convention

Use `remark-directive` container syntax, already used by Starlight's ordinary asides, rather than maintaining the experiment's custom source-marker parser. Notes remain `.md`; ordinary authors do not need component imports, JSX, or MDX.

```markdown
:::theorem[Supremum principle]{#thm-cta-supremum}
Every nonempty subset of $\mathbb{R}$ that is bounded above has a supremum.
:::

:::proof[Proof]{#proof-cta-supremum proves="#thm-cta-supremum" uses="#def-cta-supremum"}
The proof goes here, with ordinary Markdown and $\LaTeX$.
:::

See the [supremum principle](#thm-cta-supremum).
```

This is an illustrative syntax example, not a replacement statement/proof for an existing note.

- Stable explicit IDs belong to definitions/theorems/lemmas/propositions and to referenced proofs. Titles support inline math and Markdown. Titles/numbering never determine identity.
- Proofs render as native `<details><summary>`; default closed, with an explicit `open` attribute when wanted. Non-proof mathematical results render as labelled semantic sections. Styling is independent of metadata and keeps long math scrollable within its container.
- Nested containers use longer outer colon fences, following remark-directive conventions. Preserve existing nested content, not just flat blocks.
- `proves` identifies the result a proof establishes; `uses` is an explicit space-separated list of Markdown references (`#local-id` or `../other-note.md#result-id`). Ordinary explanatory links do **not** automatically become dependencies. Multiple proofs can establish the same result.
- Normal Markdown links remain cross-references. Rewrite source-relative `.md` destinations to canonical page URLs using one tested transform. The same resolver handles dependency metadata, asset/link paths where needed, and preview targets; preserve query strings/fragments.
- Map ordinary notes/tips/warnings onto Starlight's native asides where possible. Keep the custom layer for mathematical semantics, not a second documentation theme.
- Convert existing `///` syntax mechanically and check statements/LaTeX are unchanged. Avoid permanently supporting two full authoring languages unless a concrete need emerges. The original conventions stay authoritative until the migration is approved and implemented.

For custom interactive content, opt individual pages into `.mdx` and reusable `.astro` components when needed. An Astro component can ship a small vanilla JS module for JSXGraph; React is not required. Static theorem statements and proofs work with JavaScript disabled.

## Semantic data foundation, not a graph project

A small tested Markdown transform should produce both semantic HTML and a renderer-independent, versioned theorem registry from the **same parsed blocks**. It must not scrape styled HTML or manually maintained graph data.

A registry entry should retain: canonical page URL + exact block ID (identity), kind, Markdown title and statement, source path/position, proof/result relationships, explicitly declared dependencies, and optional rendered KaTeX HTML for previews. Preserve the content representation as the portable source; rendered HTML is a derived convenience. Exclude nested proof bodies from theorem statements.

Validate malformed metadata, duplicate IDs within a page, unresolved local dependency targets and ambiguous proof relationships with useful file/line errors. IDs may repeat across pages; canonical URL + fragment disambiguates them. Preserve optional nonreferenced blocks without inventing unstable numeric IDs.

Use deterministic per-file extraction and shared pure resolvers rather than a process-global mutable registry that can go stale on watch rebuilds. Validate registry additions, edits **and deletions** under live preview. Exact integration details should follow the tested release's content/render APIs; no bespoke filesystem daemon or second competing Markdown parser.

**Not in scope:** graph layout, ELK/TikZ generation, draggable nodes, graph UI, selecting a graph library, or attaching graph runtime code to every page. A future graph can consume the registry and choose its own renderer.

## Implementation and acceptance plan (after agreement)

1. Create a dedicated `migration/astro-starlight` worktree from the production baseline plus the approved preview tooling. Leave the Quartz worktree and port 2718 alone; use port 4321 for Astro.
2. Record a baseline inventory of pages, URLs, generated heading/block IDs, links, assets and navigation. Migrate to conventional `src/content/docs/`, `src/content.config.ts`, `public/`, site styles/components, and `astro.config.*` instead of introducing a custom site layout system.
3. Configure Starlight, static output, compatible pinned packages, Unified, build-time KaTeX, exact URL policy and editorial navigation. Use small documented component overrides only where needed; keep Starlight navigation/search/ToC/theme behavior.
4. Implement/test semantic directives, metadata extraction, cross-reference resolution and hover/focus previews. Convert content without rewriting its mathematics. Do not infer or invent proof dependencies; populate only relationships explicitly established by the author/source.
5. Validate **all pages and internal links/anchors/assets** in a production build. Compare baseline IDs and page inventory, allowlisting any pre-existing broken links rather than silently dropping them. Check KaTeX errors and legacy syntax leakage.
6. Through the live browser MCP, inspect Linear Models, Normal Distribution, the Companion overview, a long Axler proof and the home page at mobile/desktop sizes and in both themes. Test nested/open proofs, deep links into collapsed content, hover/focus previews, mobile menu, search, responsive math and keyboard operation. Inspect images, not only passing selectors.
7. Verify native Markdown/CSS/component reload from the LAN URL with no browser refresh command. Starlight/Pagefind normally indexes at build time: test real search with `npm run build` plus `npm run preview -- --host 0.0.0.0`, and document this distinction instead of promising live search reindexing in dev.
8. Add build/test validation for the migration branch/PR with **no publish permission/job**. Keep production deployment unchanged while review proceeds. Once the migration is validated and the user approves switching, update the existing deployment workflow (prefer retaining `gh-pages` publishing to avoid an unnecessary Pages settings change), then merge/publish deliberately.
9. Update `README.md`, `AGENTS.md`, writing conventions and `llms.txt`; remove obsolete infrastructure only in the migration worktree. Document the architecture and deferred graph work without duplicating instructions.

## Evidence reviewed

Local reference clones were inspected rather than copied:

- Astro (`c75e897`): `packages/markdown/remark/src/index.ts` (plugin pipeline); `packages/astro/src/content/loaders/glob.ts` (ID generation hooks).
- Starlight (`b77aca9`): `src/loaders.ts`, `src/integrations/remark-asides.ts`, `src/integrations/remark-rehype.ts`, `src/integrations/pagefind.ts` and navigation/path formatting code under `packages/starlight/`.
- Quartz (`97a2d05`) plus the running experiment: `plugins/math-blocks.ts`, `plugins/legacy-urls.ts`, navigation notes, screenshot tooling, tests and preview server. Useful behaviors can be retained without vendoring Quartz.
- Hugo (`85fb23f1c`): its mathematics/passthrough render-hook and `transform.ToMath` documentation, confirming build-time KaTeX is a viable alternative.

Official references:

- [Astro Markdown and processors](https://docs.astro.build/en/guides/markdown-content/)
- [Astro islands](https://docs.astro.build/en/concepts/islands/)
- [Starlight Markdown](https://starlight.astro.build/guides/authoring-content/), [components](https://starlight.astro.build/guides/components/), [overrides](https://starlight.astro.build/guides/overriding-components/), [search](https://starlight.astro.build/guides/site-search/)
- [Hugo mathematics](https://gohugo.io/content-management/mathematics/) and [build-time rendering](https://gohugo.io/functions/transform/tomath/)
- [Astro GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/)

The project configuration and generated output were also inspected locally, the production home page was fetched, and the current Material and Quartz previews were exercised using the official MCP protocol. No Astro performance or compatibility claims here imply a migrated site has already been built.
