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

Have $n+k-1$ symbols, with $n$ zeros $0$ and $k-1$ sticks $|$.

Given an arrangement of these symbols, let $x_m$ be the number of $0$'s in the $m$th gap, where the gaps are before the first stick, between successive sticks, and after the last stick.

For example, when $n=6$ and $k=3$,

$$
(2,2,2) \longleftrightarrow 00|00|00,
$$

and

$$
(0,4,2) \longleftrightarrow |0000|00.
$$

Hence there are

$$
\binom{n+k-1}{k-1}
$$

arrangements. $\blacksquare$
///
