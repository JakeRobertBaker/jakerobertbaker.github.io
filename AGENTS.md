# Jake Notes — Astro + Starlight

Markdown mathematics notes in `src/content/docs/`; static assets in `public/`. Start with `README.md`, then read the task-specific guidance below before making changes.

## Documentation

Detailed guidance lives in `instructions/`. Keep each concept in one canonical document and link to it rather than repeating it here. Update affected documentation in the same change; maintain this map when adding or moving guidance.

For preview work, also read `instructions/local-preview.md` if present. It is optional, gitignored machine-specific context; current session instructions and verified server ownership take precedence.

### Documentation map

| Document | Read when |
| --- | --- |
| [`README.md`](README.md) | Setting up, running checks, changing architecture/dependencies, deploying or rolling back. Includes the source-directory map and commands. |
| [`instructions/example_template.md`](instructions/example_template.md) | Adding/editing notes: page checklist, sidebar/discovery, legacy anchors, mathematics, semantic blocks and proof references. |
| [`instructions/site-preview.md`](instructions/site-preview.md) | Reviewing previews: port ownership, LAN access, Playwright MCP, reload, search and screenshots. Also use the `site-visual-review` skill. |
| [`instructions/book-theme.md`](instructions/book-theme.md) | Changing the production book theme, navigation geometry, local fonts or responsive visual checks. |
| [`instructions/framework-migration-proposal.md`](instructions/framework-migration-proposal.md) | Investigating migration decisions, compatibility requirements or cutover history. This is a historical record, not the routine development guide. |

## Working rules

- Work in the current session's intended checkout. Routine content and small documentation changes may go directly on `main`; preview and run relevant checks before pushing. Use a branch/PR with green CI for infrastructure, rendering, dependencies, broad refactors or experiments. See the [workflow guidance](README.md#workflow).
- Check listeners and worktrees before starting/stopping a preview; do not assume a machine, access method or port is available. Use Astro's native controls documented in `README.md`.
- Preserve the author's mathematics and published URLs/IDs. Never refresh `tests/fixtures/legacy-site.json` merely to pass a regression. Keep `tests/site/` tracked and checked; legacy build exclusions must target only the root `site/` directory.
- Follow the architecture and validation guidance in `README.md`. For browser work, respect project trust, use fresh unauthenticated contexts and keep artifacts outside published content.
- Deploy through the tested CI pipeline only. Do not manually deploy MkDocs, edit generated `gh-pages` files or force-push its history.
