# Writing mathematical notes

## Pages and links

Notes live in `src/content/docs/` as ordinary `.md` files:

```markdown
---
title: Descriptive page title
---

## First section

Notes go here.
```

Starlight renders the page title; do not add a second H1. Use `.mdx` with imported Astro components only when interaction requires it; ordinary mathematical blocks need no imports or JSX.

Filenames determine canonical URLs, preserving case and underscores. Use ordinary Markdown links: `[a result](../other-note.md#thm-result)`, `[same page](#def-limit)`, or reference-style links. One shared transform resolves source-relative note/asset paths and proof metadata. Absolute site paths and external URLs are supported. When renaming pages/IDs, update their actual internal references; no historical aliases are required.

### Adding a page

1. Create a `.md` file under `src/content/docs/` with `title` frontmatter, as above. **No HTML anchor span is required for a new page.**
2. Add a `slug` entry to the appropriate group in `src/data/navigation.json` if the page should appear in the sidebar. Use its path relative to `src/content/docs/`, without `.md` or a leading slash; for example, `mathematics/problems/new_problem`. A `label` is optional and overrides the page title. Preserve existing editorial labels and ordering.
3. Preview the page, review mathematics/navigation, and follow the [everyday workflow](../README.md#workflow).

Search and the sitemap include new notes automatically. `public/llms.txt` is a curated guide: update it only when useful, not for every new page. No test snapshots or theorem inventories need updating.

### Sidebar policy

`src/data/navigation.json` is passed directly to Starlight's native `sidebar` option in `astro.config.mjs`. It controls presentation, **not page creation**: a note without an entry still gets a URL and, unless explicitly excluded, appears in the built search index and sitemap. The current sidebar is intentionally manual to preserve curated groups, short labels and non-alphabetical reading order. No separate page or theorem registry needs manual updating.

Manual entries are a supported Starlight pattern, not an Astro requirement. If a section grows enough that per-page entries become a nuisance, Starlight supports an `autogenerate` directory group alongside manual groups, with page-level `sidebar.label` and `sidebar.order` frontmatter. Prefer that native option over a custom generator; changing the policy should preserve existing navigation deliberately. See the [Starlight sidebar guide](https://starlight.astro.build/guides/sidebar/).

### Links and IDs

An HTML `id` is the destination of a URL's `#fragment`. Use IDs that suit the current notes (for example `#exm-nullary-set` for an example); update internal links and proof metadata when renaming them. Do not add invisible alias spans solely to preserve old external links.

Page titles use `#_top`. Ordinary `##`/`###` headings receive IDs automatically from source text/LaTeX, with `_1`, `_2`, … for repeated headings. Prefer explicit IDs on semantic blocks for references.

## Mathematics

Inline: `$f(x)=x^2$`. Display math uses `$$` on separate lines:

```markdown
$$
\begin{align*}
f(x) &= x^2 + 2x + 1 \\
     &= (x+1)^2.
\end{align*}
$$
```

KaTeX renders at build time with local CSS/fonts, not browser auto-render. Use `$...$` and `$$`; do not introduce `\(...\)`/`\[...\]` delimiters without parser support. Break long chains with `align*` and `\\`; wide matrices/equations scroll inside their container rather than widening the page. Invalid KaTeX fails the build.

## Semantic mathematical blocks

Use remark-directive container syntax, **not** the old PyMdown `///`, `!!!`, `???`, or MDX components for ordinary blocks:

```markdown
:::definition[Limit point]{#def-limit-point}
A *limit point* of $F \subseteq \mathbb{R}$ is a point $x$ such that …
:::

:::theorem[A useful result]{#thm-result}
The statement, with ordinary Markdown and $\LaTeX$.
:::

:::proof[Proof]{#proof-result proves="#thm-result" uses="#def-limit-point ../other-note.md#lem-helper"}
The proof goes here. $\blacksquare$
:::
```

Kinds: `definition`, `theorem`, `lemma`, `proposition`, `corollary`, `example`, `proof`, `remark`, and `notation`. Titles support inline math/Markdown and can be omitted. The kind is included in the rendered label.

Use `remark` for a mathematical observation or qualification, and `notation` for symbol/convention setup, rather than using a note solely for its visual styling:

```markdown
:::remark[About the hypothesis]{#rem-hypothesis}
The assumption is used only in the final step.
:::

:::notation{#not-space}
Write $X$ for the underlying space.
:::
```

Standard `note`, `tip`, `caution`, `danger` remain native Starlight asides: notes/tips are general annotations, while caution/danger retain alert semantics. A remark/notation block is referenceable exposition, not automatically a theorem or a proof dependency. Exercises and solutions may remain ordinary headings, especially in long exercise sets. Do not infer a block's kind from its ID prefix, or add unused directive aliases; introduce a new semantic kind deliberately with validation, rendering and tests.

- Give referenced results/proofs an explicit ID (`#thm-result`). IDs begin with a letter and contain letters, digits, `_`, `.`, or `-`; references are case-sensitive. Identity is canonical page URL + fragment, not title or numbering. Same IDs on different pages are allowed.
- Proofs use native `<details>` and default closed. Add `{open}` alongside other attributes to begin expanded. Never use `open="false"` (a present HTML boolean attribute means true).
- `proves` identifies exactly one result established by this proof. `uses` lists explicitly declared result dependencies separated by whitespace. Eligible result kinds are `definition`, `theorem`, `lemma`, `proposition`, `corollary` and `example`; remarks, notation, notes and proofs can be linked normally but are not result targets for these relationships. They use the same reference syntax as links. Relationship-bearing proofs need explicit IDs; `uses` also requires `proves`.
- Ordinary explanatory links do not create dependency edges. Do not infer proof dependencies from prose. Unannotated/unidentified existing proofs may remain so until the author declares relationships.
- Only identified blocks appear in `/theorems.json`. It stores kind, Markdown title/statement, source location, canonical URL and explicit proof relationships, independently of a future graph renderer. Nested proof text is excluded from a theorem's statement.
- Unknown block types/options, duplicate block IDs and unresolved declared dependencies are errors. The site suite also catches collisions with headings and broken ordinary references.

For nesting, use a longer outer colon fence:

```markdown
::::theorem[Result with a nested proof]{#thm-nested}
Statement.

:::proof
Proof content.
:::
::::
```

Normal links to mathematical blocks receive same-origin hover/keyboard-focus previews automatically. Links remain ordinary navigation without JavaScript. Hash navigation opens containing proofs when JavaScript is available; native disclosure still works without it.

For static image attributes use standard HTML, e.g. `<img src="/assets/triangle.png" alt="Projection geometry" width="50%">`; Python-Markdown `{ width=... }` and `{data-preview}` suffixes are no longer recognized.

## Exercise notes and transcription

Keep the author's wording unless a correction is explicitly requested. Establish a source abbreviation once, such as Axler's *Measure, Integration & Real Analysis* (MIRA), then use `(MIRA, 2.5)` consistently.

Use sections such as `## Exercise 1`, `### Question`, `### Solution`, with optional **Key idea:**, **(i)** / **(ii)**, italic first-use terms, and ` $\blacksquare$` at the end of proofs. Preserve mathematical content when improving only formatting.

Do not implement graph UI or manually maintain theorem graph data as part of writing notes. Add explicit proof metadata where justified; visualization is a separate future consumer.
