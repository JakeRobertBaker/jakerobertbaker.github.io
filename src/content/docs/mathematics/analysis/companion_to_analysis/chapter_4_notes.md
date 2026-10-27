---
title: "Chapter 4"
---
<!-- snippets: latex_math -->

## Limit definitions

:::definition[Limit of a function]{#def-limit}
Let

$$
\begin{array}{ll}
\bullet\ E \subseteq \mathbb{R}^m & \bullet\ \mathbf{x} \in \mathbb{R}^m \\[0.5em]
\bullet\ f : E \setminus \left\{ \mathbf{x} \right\} \to \mathbb{R}^p & \bullet\ \mathbf{a} \in \mathbb{R}^p
\end{array}
$$

Then $f(\mathbf{y}) \to \mathbf{a}$ as $\mathbf{y} \to \mathbf{x}$ iff for any $\epsilon > 0$, there exists $\delta > 0$ such that

$$
\mathbf{y} \in E :
\| \mathbf{y} - \mathbf{x} \| < \delta \implies \| f(\mathbf{y}) - \mathbf{a} \| < \epsilon.
$$
:::
