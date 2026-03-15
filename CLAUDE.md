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

## Math formatting

Inline math: $f(x) = x^2$

Display math (`$$` must be on its own line — single-line `$$...$$` renders a stray `$` with `pymdownx.arithmatex`):

The site has a fixed max width — avoid wide display equations. Break long chains of inequalities or equalities using `\\` line breaks or `align*` with `&` before each relation and `\\` at each line break:

$$
\begin{align*}
\sum_{k=1}^{\infty} \ell(I_k) + \sum_{k=1}^{\infty} \ell(J_k)
&< (b-a)+(d-c)-\eta + (c-b)+\varepsilon \\
&= (d-a) + (\varepsilon - \eta) \\
&< d-a.
\end{align*}
$$
