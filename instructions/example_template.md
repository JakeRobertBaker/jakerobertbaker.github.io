# Example Template — MkDocs Material Site Markdown

This file documents the markdown conventions used in this project. Use it as a reference when cleaning up or writing markdown.

---

## Math

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

---

## Admonitions (pymdownx.blocks)

**Do NOT use classic `!!!` or `???` syntax.** Use block syntax only.

### Standard admonitions (non-collapsible)

```
/// note | Title
Content here.
///
```

```
/// definition | Limit Point
    attrs: {id: def-limit_point}

A *limit point* of a set $F \subseteq \mathbb{R}$ is a point $x \in \mathbb{R}$ such that...
///
```

Available types: `note`, `abstract`, `info`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `bug`, `example`, `quote`, `definition`, `proposition`, `lemma`, `theorem`

### Collapsible details

```
/// proof
Content of the proof.
///
```

The `proof` type is collapsible (renders as a `<details>` element).

### Referencing blocks

- Same page: `[text](#def-limit-point)`
- Cross page: `[text](./other-page.md#def-limit-point){data-preview}`
- Reusable reference link: define `[My Def]: #def-limit-point` once, then use `[My Def]` anywhere in the file

---

## Exercise file structure

The source can be any textbook or paper. Use a short abbreviation in parenthetical references, e.g. `(MIRA, 2.5)` for Axler's *Measure, Integration & Real Analysis*, or `(Rudin, Thm 3.6)`, `(Vaswani et al., 2017)`, etc.

```markdown
# Exercises 2A — Outer Measure on $\mathbb{R}$

**Source:** Axler, *Measure, Integration & Real Analysis* (MIRA), Section 2A, pp. 23–24.

## Exercise 1

### Question
Statement of the exercise quoted verbatim.

### Solution
**Key idea:** (optional — one sentence summarising the trick or main insight)

Optionally use definitions or admonitions if needed.

Proof body. Reference results with a short abbreviation, e.g. (MIRA, 2.5) or (MIRA, Definition 2.2).

$$
|A \cup B| \leq |A| + \varepsilon.
$$

Since $\varepsilon > 0$ was arbitrary, we conclude $|A \cup B| \leq |A|$. $\blacksquare$

---

## Exercise 2
...
```

---

## Formatting conventions

- Bold labels: `**Proof.**`, `**Key idea:**`, `**(i)**`, `**(ii)**`
- Italics for emphasis and first use of terms: `*limit point*`, `*closed*`
- Parenthetical references to source material: `(MIRA, 2.5)`, `(Rudin, Thm 3.6)`, `(Vaswani et al., 2017, §3.2)` — use whatever abbreviation was established in the **Source** line
- End proofs with `$\blacksquare$` on its own line or at the end of the last display equation
- Multi-part proofs: label parts `**(i)**` / `**(ii)**` or with descriptive bold headers e.g. `**$F$ is closed:**` / `**$F$ is bounded:**`
