# Combinatorial Proofs and Definitions

## Permutations and Combinations

Consider a size $n$ set $A$.

A size $r \leq n$ permutation is a length $r$ tuple $(a_1,\dots,a_r)$ where each $a_i \in A$ appears exactly once. In other words a permutation is a size $r$ sample without replacement.

A size $r$ combination is length $r$ subset of $A$.

There are

$$
n \times (n-1) \times \dots \times (n-r+1) = \frac{n!}{(n-r)!}
$$

size $r$ permutations.

Any size $r$ tuple maps to size $r$ combination via

$$
(a_1,\dots,a_r) \mapsto \{a_1,\dots,a_r\}.
$$

There are $r!$ possible permutations that map to combination $\{a_1,\dots,a_r\}$.

Hence there are

$$
\binom{n}{r} \coloneqq \frac{n!}{r!(n-r)!}
$$

possible size $r$ combinations.

## Multinomial Coefficients

Let us say that we are taking the items of set $A$ and putting them into $m$ bins of size $k_i$ such that $\sum_{i=1}^m k_i = n$.

Any length $n$ permutation of $A$'s elements maps to a possible allocation by the first $k_1$ elements being in bin 1, the next $k_2$ elements being in bin 2 and so on.

$$
|a_1 \dots a_{k_1}| |a_{k_1+1} \dots a_{k_1+k_2}| \dots |a_{n-k_m+1} \dots a_n|
$$

Each of these $m$ bins can be reordered $k_i!$ times. Therefore there are $\prod_{i=1}^m k_i!$ possible permutations that give this bin allocation.

Define the number of ways to put $n$ distinct items into $m$ bins of size $k_i$ for $i=1 \dots m$ as the multinomial coefficient $\binom{n}{k_1,k_2,\dots,k_m}$.

We have just shown that

$$
\binom{n}{k_1,k_2,\dots,k_m} = \frac{n!}{k_1! \dots k_m!}.
$$

When we consider each $a_j$ corresponding to a trial $j$ from a set of trials and each bin as a possible outcome we can see that multinomial coefficients are the number of possible ways to have $k_i$ outcomes of type $i$ for $i=1 \dots m$.

## Number of Integer Sums to $n$

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
