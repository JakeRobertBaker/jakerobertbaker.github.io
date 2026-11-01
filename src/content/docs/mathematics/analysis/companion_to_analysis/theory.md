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

:::theorem[1.35 Intermediate Value Theorem]{#thm-IVT}
If,
- $f: [a,b] \to \mathbb{R}$ is continuous
- $f(a) \geq 0 \geq f(b)$

Then, $\exists c \in [a,b] : f(c) = 0$
:::

:::theorem[1.42 The mean value inequality]{#thm-MVI}
Let,
- $U=\left( \alpha, \beta \right)$ be an open interval on $\mathbb{R}$.
- $a,b \in U$ and $a<b$
- $f: U \to \mathbb{R}$ be differentiable
- $f'(t) \leq K \ \forall t \in U$

Then, $f(b) - f(a) \leq K (b-a)$
:::
