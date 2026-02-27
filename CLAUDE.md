## Admonitions (pymdownx.blocks)

Syntax uses `/// type | title` blocks. Types are configured in `mkdocs.yml` under `pymdownx.blocks.admonition` and `pymdownx.blocks.details`.

### Admonition types

`note`, `abstract`, `info`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `bug`, `example`, `quote`, `definition`, `proposition`, `lemma`, `theorem`

### Collapsible detail type

`proof` (configured under `pymdownx.blocks.details`)

### Example

/// definition | My Definition
    attrs: {id: def-my-thing}

Content goes here.
///

/// proof | Proof of Theorem 1
Collapsible content.
///

## Referencing Admonitions

### Same page

The `attrs: {id: def-my-thing}` line in the example above gives that definition block the HTML id `def-my-thing`. Link to it with `[text](#def-my-thing)`.

### Cross page

`[My Definition](./other-page.md#def-my-thing){data-preview}` — links to that definition on another page with hover preview. Requires `attr_list` extension (enabled).

### Reusable reference links

Define a named reference once, then reuse the short label anywhere in the same file:

```markdown
[My Definition]: #def-my-thing

See [My Definition] for background. As noted in [My Definition], ...
```
