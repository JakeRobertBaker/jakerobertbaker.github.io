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

Starlight renders the page title; do not add a second H1. Preserve editorial sidebar labels/order in `src/data/navigation.json`. Use `.mdx` with imported Astro components only when interaction requires it; ordinary mathematical blocks need no imports or JSX.

Filenames determine canonical URLs, preserving case and underscores. Use ordinary Markdown links: `[a result](../other-note.md#thm-result)`, `[same page](#def-limit)`, or reference-style links. One shared transform resolves source-relative note/asset paths and proof metadata. Absolute site paths and external URLs are supported. Do not rename published pages/IDs without compatibility handling.

Existing source H1 anchors are retained as small HTML spans in migrated pages. The heading-ID policy intentionally retains the previous ASCII/Python-Markdown convention, using source LaTeX before KaTeX rendering and `_1`, `_2`, … for repeated headings. For new long-lived cross-references, prefer explicit IDs on semantic blocks, not generated heading anchors.

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

Kinds: `definition`, `theorem`, `lemma`, `proposition`, `corollary`, `example`, and `proof`. Standard `note`, `tip`, `caution`, `danger` remain native Starlight asides. Titles support inline math/Markdown and can be omitted. The kind is included in the rendered label.

- Give referenced results/proofs a permanent ID (`#thm-result`). IDs begin with a letter and contain letters, digits, `_`, `.`, or `-`; preserve legacy spelling/case. Identity is canonical page URL + fragment, not title or numbering. Same IDs on different pages are allowed.
- Proofs use native `<details>` and default closed. Add `{open}` alongside other attributes to begin expanded. Never use `open="false"` (a present HTML boolean attribute means true).
- `proves` identifies exactly one result established by this proof. `uses` lists explicitly declared result dependencies separated by whitespace. They use the same reference syntax as links. Relationship-bearing proofs need explicit IDs; `uses` also requires `proves`.
- Ordinary explanatory links do not create dependency edges. Do not infer or invent proof dependencies during transcription/migration. Unannotated/unidentified existing proofs may remain so until the author declares relationships.
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
