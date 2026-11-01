---
title: Theory
---
<!-- snippets: latex_math -->

:::definition[The fundamental axiom of analysis]{#def-fundamental-axiom}
If,
- $a_n \in \mathbb{R} \forall n \in \mathbb{N}$
- $A \in R$
- $a_{n} \leq a_{n+1} \forall n \in \mathbb{N}$
- $a_{n} < A \forall n \in \mathbb{N}$

Then, $\exists a \in \mathbb{R} : a_{n} \to n \text{ as } n \to \infty$.
:::

:::proof[Theorem 3.15; direct proof: Exercise 3.16]{#prf-FA-from-SUP proves="#def-fundamental-axiom" uses="#thm-Sup"}
See Theorem 3.15 and Exercise 3.16 of the book.
:::

:::proof[Exercise 1.54]{#prf-FA-from-MVI proves="#def-fundamental-axiom" uses="#thm-MVI"}
See Exercise 1.54 of the book.
:::

:::proof[Theorem 1.53]{#prf-FA-from-IVT proves="#def-fundamental-axiom" uses="#thm-IVT"}
See Theorem 1.53 of the book.
:::

:::theorem[1.35 Intermediate Value Theorem]{#thm-IVT}
If,
- $f: [a,b] \to \mathbb{R}$ is continuous
- $f(a) \geq 0 \geq f(b)$

Then, $\exists c \in [a,b] : f(c) = 0$
:::

:::proof[Theorem 1.35]{#prf-IVT-from-FA proves="#thm-IVT" uses="#def-fundamental-axiom"}
See Theorem 1.35 of the book.
:::

:::proof[Theorem 3.12]{#prf-IVT-from-SUP proves="#thm-IVT" uses="#thm-Sup"}
See Theorem 3.12 of the book.
:::

:::theorem[1.42 The mean value inequality]{#thm-MVI}
Let,
- $U=\left( \alpha, \beta \right)$ be an open interval on $\mathbb{R}$.
- $a,b \in U$ and $a<b$
- $f: U \to \mathbb{R}$ be differentiable
- $f'(t) \leq K \ \forall t \in U$

Then, $f(b) - f(a) \leq K (b-a)$
:::

:::proof[Lemma 1.45; Theorem 1.42]{#prf-MVI-from-FA proves="#thm-MVI" uses="#def-fundamental-axiom"}
See Lemma 1.45 and Theorem 1.42 of the book.
:::

:::proof[Lemma 3.14; Theorem 1.42]{#prf-MVI-from-SUP proves="#thm-MVI" uses="#thm-Sup"}
See Lemma 3.14 and Theorem 1.42 of the book.
:::

:::definition[Supremum]{#def-Sup}
Let $A \subseteq \mathbb{R}$ be non empty.

$\alpha$ is the least upper bound (supremum) of A if

1. $\alpha \geq a \ \forall a \in A$.
2. $\beta \geq a \ \forall a \in A \implies \beta \geq \alpha$
:::

:::theorem[Theorem 3.7 Supremum Principle]{#thm-Sup}
Let,
- $A \subseteq \mathbb{R}$ be non empty.
- $A$ is bounded above, $\exists K \in \mathbb{R} : a \leq K\ \forall a \in A$

Then, $A$ has a supremum.
:::

:::proof[Theorem 3.7; Exercises 3.9 or 3.10]{#prf-SUP-from-FA proves="#thm-Sup" uses="#def-fundamental-axiom"}
See Theorem 3.7 and Exercises 3.9 or 3.10 of the book. [Exercise 3.9](chapter_3_notes.md#ex-39) is worked in the chapter 3 notes.
:::
