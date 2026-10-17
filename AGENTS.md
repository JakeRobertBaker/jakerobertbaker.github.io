# Project: Jake Notes — Astro + Starlight

## Start here

- Read `README.md` for architecture, commands, dependency policy and deployment safeguards.
- Read `instructions/example_template.md` before writing/editing notes or mathematical blocks. Preserve the author's mathematical wording; migration is not permission to correct statements.
- Content: `src/content/docs/`; static assets and `llms.txt`: `public/`.

## Development and validation

- Normal development is in `/home/jake/jakerobertbaker.github.io` on `main`; archived migration/Quartz worktrees do not own the active preview. `npm ci`, then `npm run dev`: native live preview on `0.0.0.0:2718` (LAN host: `192.168.178.20`). The user authorized repurposing this port. Check listeners/worktrees before starting or stopping servers.
- Astro 7 native background controls: `npm run dev -- status`, `npm run dev -- logs --follow`, `npm run dev -- stop`.
- Run `npm run check`, `npm run test:math`, `npm run build`, `npm run test:preview`, and `npm run test:site` after relevant changes. Browser dependencies/setup and the build-only Pagefind search distinction are documented in `README.md`.
- Full-site regressions live in `tests/site/`; do not restore the old generic `site/` ignore pattern, which would hide those tests. Their managed preview uses native `--ignore-lock` to stay foreground-owned by Playwright instead of Astro's agent-detected daemon.
- Use the `site-visual-review` skill and `instructions/site-preview.md` for official Playwright MCP review, screenshots and LAN/reload checks. Respect Pi's project trust. Do not reuse authenticated profiles or publish screenshots.

## Architectural constraints

- Static Astro output, Starlight's native docs UI, explicitly selected Unified processor, build-time KaTeX (not MathJax or client auto-render).
- Concise `:::` directives for semantic blocks; native collapsible proofs. Keep IDs stable and explicit. The shared resolver handles Markdown links and explicit proof dependencies.
- Registry data comes from the same Markdown AST via Astro render metadata. No process-global mutable extraction cache, duplicate source parser, manually maintained graph data or interactive graph implementation.
- Use documented sidebar/frontmatter/hooks and small scoped styles/overrides, not a vendored theme or browser DOM rewrites. No React unless a concrete interactive component warrants it; ordinary notes remain `.md`.
- Preserve legacy case, underscores, repeated basenames, URLs and anchors. Never silently refresh `tests/fixtures/legacy-site.json` to hide regressions.

## Deployment and maintenance

- The user approved the Astro production cutover after manual review. Normal deployment is automatic on `main`: `ci.yml` calls reusable read-only validation, then a separate write-enabled job publishes the tested artifact to `gh-pages`. GitHub Pages remains branch-based (`gh-pages`, `/`).
- Use source branches/PRs and require green CI before merging. Do not run manual `mkdocs gh-deploy`, edit generated `gh-pages` files or force-push its history. See `README.md` for the pipeline, backup tags and source-based rollback.
- Validation artifacts must include hidden files (`.nojekyll`). Keep publishing `main`-only, preserve `gh-pages` history, and confine write permissions to the publishing job.
- Update `README.md` and `AGENTS.md` for infrastructure/config changes; keep detailed conventions in `instructions/` and link rather than duplicate them.
- Keep `public/llms.txt` synchronized when notes are added or removed. Native sitemap files are the exhaustive URL inventory; preserve the legacy sitemap endpoint.
