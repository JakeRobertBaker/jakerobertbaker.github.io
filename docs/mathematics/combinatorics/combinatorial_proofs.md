# Combinatorial Proofs and Definitions

## Stars and Bars

/// lemma | Stars and Bars
    attrs: {id: lem-stars-and-bars}

For fixed $n,k \in \mathbb{N}$,

$$
\left|
\left\{
(x_1,\dots,x_k)
\;\middle|\;
\sum_{i=1}^{k} x_i = n,\ 0 \leq x_i \leq n
\right\}
\right|
=
\binom{n+k-1}{k-1}.
$$

///

/// proof | Proof

Have $n+k-1$ symbols, with $n$ integers $0$ and $k-1$ sticks $|$.

$$
\begin{array}{c c c}
\left\langle
\begin{array}{c}
\text{start of sequence} \\
\text{or }(m-1)\text{th} \\
\text{stick}
\end{array}
\right\rangle
&
\underbrace{0\cdots0}_{x_m\ 0\text{'s}}
&
\begin{array}{c}
| \\
\uparrow \\
m\text{th stick}
\end{array}
\end{array}
$$

e.g. $n=6$, $k=3$

$$
(\textcolor{red}{2},\textcolor{green}{2},\textcolor{blue}{2})
\Longleftrightarrow
\textcolor{red}{00}|\textcolor{green}{00}|\textcolor{blue}{00}
$$

$$
(\textcolor{red}{0},\textcolor{green}{4},\textcolor{blue}{2})
\Longleftrightarrow
|\textcolor{green}{0000}|\textcolor{blue}{00}
$$

Hence there are

$$
\binom{n+k-1}{k-1}
$$

arrangements. $\blacksquare$
///
