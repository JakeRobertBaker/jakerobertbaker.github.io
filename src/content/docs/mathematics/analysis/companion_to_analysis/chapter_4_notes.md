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

### Proposition from Exercise


Let $E,\mathbf{x}, f, \mathbf{a}$ be as in the above definition.


Define $\tilde{f} : E \to \mathbb{R}^p$ by

$$
\tilde{f}(\mathbf{y}) =
\begin{cases}
f(y) & \text{ if } \mathbf{y \neq x} \\
\mathbf{a} & \text{ if } \mathbf{y=x}
\end{cases}
$$

Then, $\tilde{f}(\mathbf{y}) \to \mathbf{a}$ as $\mathbf{y \to x}$ iff $\tilde{f}$ is continuous at $\mathbf{x}$.
