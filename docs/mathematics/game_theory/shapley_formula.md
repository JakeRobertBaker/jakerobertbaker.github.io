<!-- snippets: latex_math -->
# Shapley Formula

## Setup

Let $N = \{1, \dots, n\}$ be the set of players and $S \subseteq N$ a coalition. A **cooperative game** is a characteristic function $v : \mathcal{P}(N) \to \mathbb{R}$ with $v(\varnothing) = 0$, assigning a value to every coalition.

/// definition | Shapley Value
    attrs: {id: def-shapley-value}

The **Shapley value** $\phi_i(v)$ is the fair share awarded to player $i$:

$$
\phi_i(v)
= \frac{1}{n} \sum_{k=0}^{n-1}
\operatorname{mean}\!\left\{
v\!\left(S \cup \{i\}\right) - v(S)
\;\middle|\;
S \subseteq N \setminus \{i\},\ |S| = k
\right\}
$$

///

## Derivation

Expanding the mean over all coalitions of size $k$ explicitly:

$$
\phi_i(v)
= \frac{1}{n}
\sum_{k=0}^{n-1}
\frac{1}{\dbinom{n-1}{k}}
\sum_{\substack{S \subseteq N \setminus \{i\} \\ |S|=k}}
\left(
v\!\left(S \cup \{i\}\right) - v(S)
\right)
$$

For $|S| = k$ the prefactor simplifies as

$$
\frac{1}{n\dbinom{n-1}{k}}
= \frac{k!\,(n-k-1)!}{n!}
= \frac{|S|!\,(n-|S|-1)!}{n!},
$$

so collecting over all $S \subseteq N \setminus \{i\}$ gives the standard form:

/// theorem | Shapley Formula
    attrs: {id: thm-shapley-formula}

$$
\phi_i(v)
= \sum_{S \subseteq N \setminus \{i\}}
\frac{|S|!\,(n-|S|-1)!}{n!}
\left(
v\!\left(S \cup \{i\}\right) - v(S)
\right)
$$

///
