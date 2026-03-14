# Example Template — MkDocs Material Site Markdown

This file documents the markdown conventions used in this project. Use it as a reference when cleaning up handwritten exercise solutions.

---

## Math

Inline math: $f(x) = x^2$

Display math (`$$` must be on its own line — single-line `$$...$$` renders a stray `$` with `pymdownx.arithmatex`):

$$
\sum_{k=1}^{\infty} \frac{1}{k^2} = \frac{\pi^2}{6}
$$

The site has a fixed max width — avoid wide display equations. Break long chains of inequalities or equalities using `\\` line breaks or `align*` with `&` before each relation and `\\` at each line break:

$$
\begin{align*}
\sum_{k=1}^{\infty} \ell(I_k) + \sum_{k=1}^{\infty} \ell(J_k)
&< (b-a)+(d-c)-\eta + (c-b)+\varepsilon \\
&= (d-a) + (\varepsilon - \eta) \\
&< d-a.
\end{align*}
$$

Use `\varepsilon` (not `\epsilon`), `\mathbb{R}`, `\mathbb{Z}^+`, `\infty`, `\leq`, `\geq`, `\subseteq`, `\setminus`, `\bigcup`, `\bigcap`, `\tfrac{1}{n}` (inline fractions in text), `\blacksquare` (end of proof).

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

### Adding an anchor ID

```
/// definition | My Definition
    attrs: {id: def-my-thing}

Content here.
///
```

Then reference it:

- Same page: `[text](#def-my-thing)`
- Cross-page: `[text](./other-page.md#def-my-thing){data-preview}`

---

## Exercise file structure

The source can be any textbook or paper. Use a short abbreviation in parenthetical references, e.g. `(MIRA, 2.5)` for Axler's *Measure, Integration & Real Analysis*, or `(Rudin, Thm 3.6)`, `(Vaswani et al., 2017)`, etc.

```markdown
# Exercises 2A — Outer Measure on $\mathbb{R}$

**Source:** Axler, *Measure, Integration & Real Analysis* (MIRA), Section 2A, pp. 23–24.

---

## Exercise 1

> Statement of the exercise quoted verbatim.

**Key idea:** (optional — one sentence summarising the trick or main insight)

/// definition | Relevant Definition
    attrs: {id: def-foo}

Statement of definition.
///

**Proof.**

Proof body. Reference results with a short abbreviation, e.g. (MIRA, 2.5) or (MIRA, Definition 2.2).

$$
|A \cup B| \leq |A| + \varepsilon.
$$

Since $\varepsilon > 0$ was arbitrary, we conclude $|A \cup B| \leq |A|$. $\blacksquare$

---

## Exercise 2

> Next exercise...
```

---

## Formatting conventions

- Bold labels: `**Proof.**`, `**Key idea:**`, `**(i)**`, `**(ii)**`
- Italics for emphasis and first use of terms: `*limit point*`, `*closed*`
- Parenthetical references to source material: `(MIRA, 2.5)`, `(Rudin, Thm 3.6)`, `(Vaswani et al., 2017, §3.2)` — use whatever abbreviation was established in the **Source** line
- Horizontal rules `---` between exercises
- End proofs with `$\blacksquare$` on its own line or at the end of the last display equation
- Multi-part proofs: label parts `**(i)**` / `**(ii)**` or with descriptive bold headers e.g. `**$F$ is closed:**` / `**$F$ is bounded:**`
