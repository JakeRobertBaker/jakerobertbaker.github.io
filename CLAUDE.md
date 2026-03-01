# Project: MkDocs Material site (jakerobertbaker.github.io)

## Dev commands

- Preview: `uv run mkdocs serve --livereload`
- Deploy: `uv run mkdocs gh-deploy`

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

## Code style

- KaTeX for math (not MathJax) via `pymdownx.arithmatex` with `generic: true`
- Content lives in `docs/`; theme overrides in `overrides/`
