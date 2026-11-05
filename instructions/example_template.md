# Notes Transcriber — Markdown conventions

This is a self-contained guide for transcribing handwritten mathematical notes into Markdown for Jake Notes (Astro + Starlight). It can be uploaded directly to a ChatGPT project; no repository files are needed to use it.

## Transcription rules

- Return the note as Markdown, with title frontmatter as shown below. Do not include commentary outside the transcription unless clarification is needed.
- Preserve the author's mathematics, notation, wording and logical structure. Do not silently correct arguments, fill gaps, invent proofs or add claims.
- If handwriting is ambiguous or illegible, ask for clarification or mark the uncertainty explicitly rather than guessing.
- Use ordinary `.md` syntax. Do not use imports, JSX, MkDocs `///`, `!!!` or `???` blocks, or `{data-preview}` link attributes.
- Do not generate sidebar configuration or repository commands. Use `proves` only for a proof the notes present as the proof of a specific stated result; add `uses` only when explicitly requested.

## Page structure and exercises

Every page starts with YAML frontmatter. Quote the title; escape embedded double quotes and backslashes if needed. The site renders the title, so do not repeat it as an H1. Start sections at `##`.

```markdown
---
title: "Exercises 2A — Outer Measure"
---

**Source:** Axler, *Measure, Integration & Real Analysis* (MIRA), Section 2A, pp. 23–24.

## Exercise 1

### Question
Statement of the exercise.

### Solution
**Key idea:** Optional summary, only if present in the notes or requested.

The argument, citing (MIRA, 2.5) where appropriate.

$$
|A \cup B| \leq |A| + \varepsilon.
$$

Since $\varepsilon > 0$ was arbitrary, the conclusion follows. $\blacksquare$
```

Use this structure when appropriate, not as mandatory boilerplate for every note. Establish source abbreviations once when the source is known; do not invent bibliographic details. Use consistent parenthetical references such as `(MIRA, 2.5)` or `(Rudin, Thm 3.6)`.

Use **(i)** / **(ii)** for parts, descriptive bold labels for proof steps, and italics for first-use terms or emphasis. End completed proofs with `$\blacksquare$`; do not imply that an unfinished argument is complete.

## Mathematics

Use `$f(x)=x^2$` for inline math and `$$` on separate lines for display math. Do not use `\(...\)` or `\[...\]`. Mathematics must be valid KaTeX.

Break long equations into readable lines with `align*`, `&` before the relation and `\\` between lines:

```markdown
$$
\begin{align*}
f(x) &= x^2 + 2x + 1 \\
     &= (x+1)^2.
\end{align*}
$$
```

## Semantic mathematical blocks

Use directive containers for mathematical statements and proofs:

```markdown
:::definition[Limit point]{#def-limit-point}
A *limit point* of $F \subseteq \mathbb{R}$ is a point $x$ such that …
:::

:::theorem[A useful result]{#thm-result}
The statement, with ordinary Markdown and $\LaTeX$.
:::

:::proof{proves="#thm-result"}
The proof goes here. $\blacksquare$
:::

:::proof
A proof that is not attached to a stated result. $\blacksquare$
:::
```

Kinds: `definition`, `theorem`, `lemma`, `proposition`, `corollary`, `example`, `exercise`, `proof`, `solution`, `remark`, and `notation`. Use `remark` for mathematical observations and `notation` for symbol/convention setup. Pages of numbered exercises from a source may instead keep the heading structure shown above.

Every block has the form `:::kind[Title]{#id …}`, with one `{...}` attribute group after the optional title; separate attributes with spaces, e.g. `{#proof-alt open}`, never `{#proof-alt}{open}`. Titles in `[...]` are optional and support inline math/Markdown. The kind is included automatically in the rendered label; do not repeat “Theorem” or “Definition” in the title. IDs in `{#...}` are optional unless referenced. Preserve supplied IDs; for new referenced blocks, use descriptive IDs such as `def-limit-point` or `thm-result`.

Proofs are collapsible and accept these attributes, all optional:

```markdown
:::proof[Title]{#id proves="#thm-result" uses="#def-limit-point" open}
```

- `proves="#thm-result"` names the one result the proof establishes. If the title is omitted, the proof is labelled “Proof of A useful result”, linked to the result, and its ID defaults to `proof-thm-result`.
- A second proof of the same result needs its own ID, e.g. `:::proof[A second argument]{#proof-thm-result-alt proves="#thm-result"}`.
- A proof of a result on another page needs an explicit title.
- `uses="…"` lists, separated by spaces, the results the proof depends on; it requires `proves`.
- `open` starts the proof expanded; proofs are closed by default. Never use `open="false"`.
- Without `proves`, a proof is labelled “Proof” or its title.

A `solution` works exactly like a proof, with the same attributes, but is labelled “Solution to …”:

```markdown
:::exercise[Optional title]{#ex-1-2}
Show that …
:::

:::solution{proves="#ex-1-2"}
The working. $\blacksquare$
:::
```

### Numbering

Blocks other than proofs and solutions can be numbered:

- `{#lem-x n=3}` fixes a block's number: “Lemma 3”.
- `{#lem-x n=1.3 book=JS}` gives a source's own number and tags the block with the source's short name: “Lemma 1.3 · Title  JOHNSTONE”. Book IDs such as `JS` are declared by the site; use only IDs you have been given.
- Frontmatter `numbering: true` numbers every other block on the page in one sequence (1, 2, 3, …, skipping numbers fixed with `n`). Book numbers do not affect this sequence.

```markdown
---
title: "Universal Algebra"
numbering: true
---
```

To list a page's identified blocks in its “On this page” contents, add `contentsBlocks: all`, or a list of kinds such as `contentsBlocks: [theorem, lemma, exercise]`. Blocks nested inside other blocks are not listed.

Do not put numbers in titles (`[1.3. Title]`); use `n`. Only add `numbering`, `n` or `book` when the notes number their results or you are asked to.

### References

- An empty link to a block on the same page is filled with its number: `[](#lem-x)` reads “Lemma 3”, or “Johnstone 1.3” for a book result. On unnumbered pages it shows the block's title. Links to other pages need their own text.
- Inside mathematics, `\ref{lem-x}` is a linked “Lemma 3”, and `\by{lem-x}` is a linked bracketed reason “[Lemma 3]”, intended for the justification column of `align*`:

```markdown
$$
\begin{align*}
\bar{f}(t) & \\
\by{cor-self} &= \bar{f}\left(t(x_1, \dots, x_n)\right) \\
\text{[induction]} &= t_A(a_1, \dots, a_n)
\end{align*}
$$
```

- `\ref[Text]{id}` and `\by[Text]{id}` choose the text; they are required for other pages (`\by[Kunen 2.1]{other-note.md#thm-k}`) and for unnumbered targets whose titles contain math. Ordinary `\text{[…]}` reasons remain fine. A reference to an ID that does not exist fails the build.

For nesting, make the outer fence longer than the inner fence:

```markdown
::::theorem[Result with a nested proof]{#thm-nested}
Statement.

:::proof
Proof content. $\blacksquare$
:::
::::
```

For general annotations or warnings, native Starlight `note`, `tip`, `caution`, and `danger` containers are also available, e.g. `:::note[Title]` followed by content and a closing `:::`.

## Links, IDs and images

Use ordinary Markdown links:

- Same page: `[the result](#thm-result)`.
- Another source file, when its path is known: `[a lemma](../other-note.md#lem-helper)`.
- Reference-style links: define `[My result]: #thm-result`, then use `[My result]`.
- External URLs and root-relative site paths also work.

Do not invent cross-page paths or targets. Referenced block IDs must begin with a letter and contain only letters, digits, `_`, `.` or `-`. IDs are case-sensitive and unique within a page. Headings get automatic IDs, but prefer explicit block IDs when referencing results. The page title's fragment is `#_top`.

Links to identified mathematical blocks get previews automatically; no special link attributes or HTML anchors are needed.

For supplied images with known paths, use Markdown with meaningful alt text, or HTML when sizing is needed: `<img src="/assets/triangle.png" alt="Projection geometry" width="50%">`.
