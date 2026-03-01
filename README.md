# Jake Notes - MkDocs Material Site

## Development

```bash
uv run mkdocs serve --livereload
```

## Deployment

Deployment is automated via `.github/workflows/ci.yml`. Pushing to `main` triggers the workflow, which runs `mkdocs gh-deploy --force` to build the site and push it to the `gh-pages` branch. GitHub's built-in `pages-build-deployment` workflow then publishes that branch to the live site. No manual deploy step is needed.

## Admonition Blocks (pymdownx.blocks)

This project uses `pymdownx.blocks.admonition` and `pymdownx.blocks.details` - the newer block syntax. These must NOT be mixed with the classic `admonition`/`pymdownx.details` extensions (they produce identical HTML and conflict).

### Basic syntax

```markdown
/// note | Title Here
Content goes here.
///
```

### With YAML options (e.g. setting an ID)

```markdown
/// definition | Bayes' Theorem
    attrs: {id: def-bayes}

Content goes here.
///
```

The 4-space-indented `attrs:` line is YAML metadata for the block. It must come immediately after the opening `///` line, before any blank line or content.

### Collapsible block (details)

```markdown
/// proof | Proof of Theorem 1
Collapsible content - click to expand.
///
```

### All available types

| Type | Category | Colour base |
| ---- | -------- | ----------- |
| `note` | built-in | `#448aff` |
| `abstract` | built-in | `#00b0ff` |
| `info` | built-in | `#00b8d4` |
| `tip` | built-in | `#00bfa5` |
| `success` | built-in | `#00c853` |
| `question` | built-in | `#64dd17` |
| `warning` | built-in | `#ff9100` |
| `failure` | built-in | `#ff5252` |
| `danger` | built-in | `#ff1744` |
| `bug` | built-in | `#f50057` |
| `example` | built-in | `#7c4dff` |
| `quote` | built-in | `#9e9e9e` |
| `definition` | custom | `#448aff` (note) |
| `proposition` | custom | `#00bfa5` (tip) |
| `lemma` | custom | `#00c853` (success) |
| `theorem` | custom | `#64dd17` (question) |
| `proof` | custom/details | `#9e9e9e` (quote) |

## Cross-Referencing

### Same page

Give a block an `id` via `attrs:`, then link to it:

```markdown
/// definition | Sigma Algebra
    attrs: {id: def-sigma-algebra}

A sigma algebra is...
///

As defined in [Sigma Algebra](#def-sigma-algebra), ...
```

### Cross page (with hover preview)

```markdown
[Sigma Algebra](./set_theory/universal_algebra.md#def-sigma-algebra){data-preview}
```

The `{data-preview}` attribute (requires `attr_list` extension, enabled) shows a hover preview of the target block.

### Reusable reference links

Define once, use many times within the same file:

```markdown
[Sigma Algebra]: #def-sigma-algebra

See [Sigma Algebra] for background. As noted in [Sigma Algebra], ...
```

## Custom Admonition Types

Adding a custom type requires **two** independent layers:

1. **YAML registration** (`mkdocs.yml` > `pymdownx.blocks.admonition` > `types`) - the parser must know about the type name or it rejects the `///` syntax
2. **CSS** (`docs/stylesheets/extra.css`) - styles the `.admonition.typename` class; without this it falls back to default `note` colours

Neither replaces the other - both are required.

## Math (KaTeX)

Inline: `$...$` or `\(...\)`

Display:

```markdown
$$
\int_0^1 f(x)\,dx
$$
```

Configured via `pymdownx.arithmatex` with `generic: true` and KaTeX JS/CSS in `extra_javascript`/`extra_css`.

## Google Search / SEO

- **Site verification**: `overrides/main.html` contains a Google Search Console verification `<meta>` tag.
- **Crawler directives**: `docs/robots.txt` allows all crawlers and points them to the sitemap. MkDocs copies it to the build root.
- **Sitemap**: MkDocs auto-generates `sitemap.xml` at build time.
- **Meta description**: `site_description` in `mkdocs.yml` provides a fallback meta description for pages that don't set their own.

## Project Structure

```text
docs/               # Content pages
overrides/          # Theme template overrides
docs/stylesheets/   # extra.css (custom admonition styles)
docs/javascripts/   # katex.js
mkdocs.yml          # Site config, nav, extensions
```
