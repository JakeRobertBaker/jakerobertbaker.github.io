# Project: MkDocs Material site (jakerobertbaker.github.io)

## Dev commands

- Preview: `uv run mkdocs serve --livereload`
- Deploy: automated — push to `main` triggers `.github/workflows/ci.yml`, which builds and pushes to `gh-pages`. GitHub's `pages-build-deployment` then publishes to the live site. Do not run `mkdocs gh-deploy` manually.

## Markdown and Code Style

Make sure to have read @instructions/example_template.md.

### Code style

- KaTeX for math (not MathJax) via `pymdownx.arithmatex` with `generic: true`
- Content lives in `docs/`; theme overrides in `overrides/`

## Admonition syntax (pymdownx.blocks)

This project uses `pymdownx.blocks.admonition` and `pymdownx.blocks.details`, NOT the classic `admonition`/`pymdownx.details`. Do not mix them.

Block syntax: `/// type | title` closed by `///`.

Follow the guidelines in @instructions/example_template.md whenever you use blocks or need to insert something like theorem, lemma, definition etc...

### Referencing blocks

Follow guidelines in @instructions/example_template.md.

## Custom admonition types

Custom types need both YAML registration in `mkdocs.yml` (under `pymdownx.blocks.admonition` > `types`) AND CSS in `docs/stylesheets/extra.css`. Neither replaces the other.

## Maintenance rule

When adding or changing project infrastructure/config (new extensions, overrides, SEO, deploy setup), update `README.md` and `CLAUDE.md` to reflect the change.

## Transcribe/Cleanup

When transcribing written messy notes to clean katex markdown keep to the authors wording unless explicitly stated otherwise.
