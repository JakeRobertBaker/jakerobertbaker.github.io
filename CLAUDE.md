# Project: MkDocs Material site (jakerobertbaker.github.io)

## Dev commands

- Preview: `uv run mkdocs serve --livereload`
- Deploy: automated — push to `main` triggers `.github/workflows/ci.yml`, which builds and pushes to `gh-pages`. GitHub's `pages-build-deployment` then publishes to the live site. Do not run `mkdocs gh-deploy` manually.

## Admonition syntax (pymdownx.blocks)

This project uses `pymdownx.blocks.admonition` and `pymdownx.blocks.details`, NOT the classic `admonition`/`pymdownx.details`. Do not mix them.

Block syntax: `/// type | title` closed by `///`.

### Available types

Admonitions: `note`, `abstract`, `info`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `bug`, `example`, `quote`, `definition`, `proposition`, `lemma`, `theorem`

Collapsible details: `proof`

### Anchored block with ID

```markdown
/// definition | My Definition
    attrs: {id: def-my-thing}

Content here.
///
```

### Referencing blocks

- Same page: `[text](#def-my-thing)`
- Cross page: `[text](./other-page.md#def-my-thing){data-preview}`
- Reusable reference link: define `[My Def]: #def-my-thing` once, then use `[My Def]` anywhere in the file

## Custom admonition types

Custom types need both YAML registration in `mkdocs.yml` (under `pymdownx.blocks.admonition` > `types`) AND CSS in `docs/stylesheets/extra.css`. Neither replaces the other.

## SEO / site verification

- `overrides/main.html` contains the Google Search Console verification `<meta>` tag.
- `docs/robots.txt` provides crawler directives and a sitemap pointer.
- `site_description` in `mkdocs.yml` sets the fallback meta description.

## Maintenance rule

When adding or changing project infrastructure/config (new extensions, overrides, SEO, deploy setup), update `README.md` and `CLAUDE.md` to reflect the change.

## Code style

- KaTeX for math (not MathJax) via `pymdownx.arithmatex` with `generic: true`
- Content lives in `docs/`; theme overrides in `overrides/`
