<!-- snippets: latex_math -->
# Chapter 5 Notes

Note exercise 5.19 gives us key results and notation:

$$
\begin{align*}
a_j^{+} & \coloneqq
\begin{cases}
a_j & \text{ if } a_j >0 \\
0 & \text{ if } a_j \leq 0
\end{cases}
,
& a_j^{-} & \coloneqq
\begin{cases}
- a_j & \text{ if } a_j < 0 \\
0 & \text{ if } a_j \geq 0
\end{cases}
\end{align*}
$$

Let

$$
\begin{align*}
S_n & \coloneqq \sum_{j=1}^{n} a_j,
& \lvert S \rvert_n & \coloneqq \sum_{j=1}^{n} \lvert a_j \rvert \\
S_{n}^{+} & \coloneqq \sum_{j=1}^{n} a_{j}^{+},
& S_{n}^{-} & \coloneqq \sum_{j=1}^{n} a_{j}^{-} \\
\end{align*}
$$

Therefore

$$
\begin{align*}
\lvert a_j \rvert &= a_j^{+} + a_{j}^{-} \\
a_{j} &= a_{j}^{+} + a_{j}^{-}
\end{align*}
\implies
\begin{align*}
\lvert S \rvert_{n} &= S_{n}^{+} + S_{n}^{-} \\
S_{n} &= S_{n}^{+} - S_{n}^{-}
\end{align*}
$$

In 5.19 we showed that if $\sum_{j=1}^{\infty} a_j$ is convergent but not absolutely convergent then both $\sum_{j=1}^{\infty} a_{j}^{+}$ and $\sum_{j=1}^{\infty} a_{j}^{-}$ diverge.

In other words.

$S_n$ converges and $\lvert S \rvert_{n}$ not converging implies that both $S_{n}^{+}$ and $S_{n}^{-}$ do not converge.

## Exercise 5.21

Suppose that $\sum_{j=1}^{\infty} a_{j}$ is convergent but not absolutely convergent. 

Let $l \in \mathbb{R}$ and,

$$
\begin{align*}
S(0) &= \left\{ n \in \mathbb{N} : a_n < 0 \right\}, &
T(0) &= \left\{ n \in \mathbb{N} : a_n \geq 0 \right\}
\end{align*}
$$

We then inductively define $\sigma : \mathbb{N} \to \mathbb{N}$ for each $n \in \mathbb{N}$

Let $\tilde{S}_{n} \coloneqq \sum_{j=1}^{n} a_{\sigma(j)}$ and $\tilde{S}_{\infty} \coloneqq \lim_{n \to \infty} \tilde{S}_{n}$

$$
\begin{align*}
&\text{ if } \tilde{S}_{n-1} < l
\\
& \sigma \left( n \right)  \coloneqq \min T \left( n-1 \right),
& T(n) \coloneqq T(n-1) \setminus \left\{ \sigma(n) \right\},
& S(n) \coloneqq S(n-1)
\\
&\text{ if } \tilde{S}_{n-1} \geq l
\\
& \sigma \left( n \right)  \coloneqq \min S \left( n-1 \right),
& T(n) \coloneqq T(n-1),
& S(n) \coloneqq S(n-1) \setminus \left\{ \sigma(n) \right\}
\end{align*}
$$
