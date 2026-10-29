---
title: "Chapter 4"
---
<!-- snippets: latex_math -->

An easy recap.

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

### Bookwork: Composition of Limits

:::lemma[Composition of limits]{#lem-compose-limits}
If,

$$
k(h) \to k_L \text{ as } h \to h_L
\\
q(k) \to q_L \text{ as } k \to k_L
$$

Then,

$$
q(k(h)) \to q_L \text{ as } h \to h_L
$$

:::

:::proof{proves="#lem-compose-limits" open}
This could be proven via the above Exercise proposition and using results about continuity of compositions.

We can just prove it directly. The second assumption gives us,

$$
\forall \epsilon > 0 \exists \delta > 0 : \lVert k-k_L \rVert < \delta \implies \lVert q-q_L \rVert < \epsilon
$$

The first assumption gives us

$$
\exists \nu > 0 : \lVert h-h_L \rVert < \nu \implies \lVert k - k_L \rVert < \delta
$$

Hence

$$
\exists \nu > 0 : \lVert h - h_L \rVert < \nu \implies \lVert q(k(h)) - q_L \rVert < \epsilon
$$

:::
