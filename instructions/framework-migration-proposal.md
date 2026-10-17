# Astro + Starlight migration record

## Decision and isolation

The user approved **Astro + Starlight and directive-based authoring**, manually reviewed the LAN preview, and subsequently approved pushing and deploying the replacement. Migration was implemented in `/home/jake/jakerobertbaker-astro`, branch `migration/astro-starlight`, from the production baseline plus the independent browser tooling commit (`0345595`). The cutover refactors the existing automatic publishing workflow as well as the website.

The user also authorized stopping the Quartz preview and assigning **2718** to the current preview. Quartz's worktree remains unchanged. Port 8000 was not reachable from the user's machine; the migration uses the already reachable 2718 rather than modifying firewall rules.

**Production cutover is approved.** The staged rollout is: validate the pushed migration branch/PR in GitHub Actions, merge only after successful checks, then verify both publishing workflows and the live site. Backup tags preserve the prior source and generated output; see `README.md` for normal deployment and rollback.

## Why this framework

| Candidate | Assessment |
| --- | --- |
| **Astro + Starlight** | Best fit: native docs UI and live preview, supported Markdown AST extensions, build-time KaTeX, reusable Astro/optional MDX components, framework-optional client interactivity. |
| **Hugo** | Strong static toolchain and live reload; modern Hugo can render KaTeX at build time via `transform.ToMath`. A shared theorem/proof AST registry and interactive component workflow would require more bespoke integration/theme choices. |
| **Quartz 5** | Useful notes-first features and popovers, but its page graph is not a theorem graph. The experiment required editorial navigation/URL adaptations and a custom LAN watch server. Its larger core/plugin surface is unnecessary for this documentation-first site. |
| **Keep Material** | Still excellent for static notes; moving to Astro gives theorem metadata and future interactive components a shared Markdown/JS architecture rather than bridging Python-Markdown and separate client tooling. |

No comparative framework performance benchmark was used to choose the winner. Local reference clones and official docs were inspected; no framework source was copied wholesale.

## Implemented architecture

- Astro 7.4.0, Starlight 0.42.6, supported Unified processor (`@astrojs/markdown-remark`), and pinned dependencies/lockfile. Astro 7 defaults to Sätteri, so choosing Unified explicitly is important.
- Conventional content collection and directory structure, static output, native Starlight sidebar/ToC/search/theme/responsive UI. Native Astro development server, not a custom reload proxy.
- `remark-math` + `rehype-katex`, local KaTeX CSS/fonts, build-time HTML/MathML, and fatal reporting for actual math parse failures. Native proof disclosure and static math work without JavaScript.
- `remark-directive` mathematical sections/proofs, preserving native Starlight asides. Typed blocks retain explicit IDs and optional proof relationships. The shared URL resolver preserves source-relative links, fragments and legacy case/underscores/repeated basenames.
- `/theorems.json` aggregates the same render pipeline's per-file metadata into versioned, renderer-independent records. Source lines account for stripped frontmatter. It validates explicit relationships and does not infer dependencies from ordinary links. No global mutable extraction cache or second Markdown source parser.
- A small vanilla module adds theorem hover/keyboard-focus previews and opens ancestor proofs for deep links. It fetches same-origin pages on demand; it does not download a graph or re-render KaTeX in the browser.
- A tiny build hook copies Starlight's generated sitemap index to legacy `/sitemap.xml`. Search verification metadata, canonical URLs, robots policy, social links and static diagrams are retained. `llms.txt` is moved to `public/` and reconciled with all notes.
- Reusable read-only GitHub Actions validation for feature pushes/PRs and the production pipeline. The refactored `ci.yml` publishes its tested artifact from a separate `main`-only job to the existing `gh-pages` branch; native Pages then publishes that branch. Old generated assets are removed while branch history is preserved.

## Preservation and validation

Automated/browser validation covers:

- All **25 original note URLs**, including the previously unlisted Uniform Fraction page, now included under Problems.
- All **250 legacy content anchors**, including exact-case/underscore theorem IDs, source H1 aliases, math headings and repeated-heading suffixes.
- All **98 explicitly identified mathematical blocks** in the registry. The original 117 block bodies (including nested/open proofs and asides) were mechanically converted; no proof dependency metadata was invented.
- Unchanged **body LaTeX**, checked by per-page hashes captured before migration. Source H1s became editorial frontmatter titles and alias spans; home cards and the framework credit were intentionally adapted. Mathematical statements/proofs were not corrected or rewritten.
- All note images and internal links/fragment targets, no duplicate HTML IDs, no KaTeX errors or leaked legacy syntax.
- Mobile navigation/order, dark/light layout, wide math containment, proof nesting/disclosure, hover/focus previews, static mathematics without JavaScript, and real Pagefind search on a production build.
- Live MCP inspection at mobile/desktop sizes. Native Markdown reload was observed from the LAN origin without manual refresh. Disposable theorem-registry additions/edits/deletions were reflected correctly; CSS and Astro component changes also updated in the open browser. All temporary probes were removed.
- `npm run check`, math/plugin tests, browser-tool tests, production build, full-site Playwright tests, and `npm audit` passed locally, including a clean archive/install of committed source. Audit was clean after documented transitive overrides for patched KaTeX and selector parsing. GitHub Actions check/run history is the authority for hosted validation and publishing results.

`tests/fixtures/legacy-site.json` is the immutable MkDocs baseline (URLs, anchors, block IDs and body-math hashes), not a generated artifact to refresh whenever tests fail.

## Operational notes and cutover

- Live dev preview: **http://192.168.178.20:2718/**. Starlight's native dev search notice is expected: Pagefind search is build-time only. For full search review, stop dev and run `npm run build && npm run preview` on that same port, or use the loopback production-build test preview on 4322.
- Build commands force a clean content render, avoiding stale imported Markdown-plugin metadata. After plugin changes, restart dev with `--force`; ordinary Markdown, CSS and component edits reload natively.
- The pre-rendered theorem dependency SVGs remain ordinary content assets. **No interactive theorem graph, graph renderer or graph library is implemented.** Future graph work can consume the semantic registry.
- Dependency metadata is supported and tested, but existing proofs remain unannotated until the author explicitly declares relationships.
- The user approved replacing the MkDocs publishing steps with tested Astro build/validation and `dist/` publication to the existing `gh-pages` branch, including `.nojekyll`. GitHub Pages settings remain unchanged.
- Source and generated-output backup tags are `pre-astro-source-2026-10-17` and `pre-astro-pages-2026-10-17`. `README.md` describes normal deployment and source-based rollback; do not maintain generated files manually.

## References reviewed

Local sources: Astro (`c75e897`) Markdown processor and content-loader code; Starlight (`b77aca9`) loaders, directive/asides pipeline, navigation and Pagefind integration; Quartz (`97a2d05`) plus experiment math-block/legacy-URL/navigation/preview implementations; Hugo (`85fb23f1c`) math/passthrough and `transform.ToMath` docs.

Official documentation: [Astro Markdown/processors](https://docs.astro.build/en/guides/markdown-content/), [Unified API](https://docs.astro.build/en/reference/markdown-processors/unified/), [islands](https://docs.astro.build/en/concepts/islands/), [Starlight authoring](https://starlight.astro.build/guides/authoring-content/), [components](https://starlight.astro.build/guides/components/), [overrides](https://starlight.astro.build/guides/overriding-components/), [search](https://starlight.astro.build/guides/site-search/), [Hugo mathematics](https://gohugo.io/content-management/mathematics/), [Hugo build-time math](https://gohugo.io/functions/transform/tomath/), [GitHub Pages](https://docs.astro.build/en/guides/deploy/github/).
