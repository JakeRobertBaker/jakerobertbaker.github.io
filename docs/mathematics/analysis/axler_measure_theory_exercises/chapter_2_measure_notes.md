<!-- snippets: latex_math -->
# Chapter 2 - Measure Notes

**Source:** Axler, *Measure, Integration & Real Analysis* (MIRA), Chapter 2.

/// definition | Outer Measure
    attrs: {id: def-outer_measure}

Let $A \subseteq \mathbb{R}$. The *outer measure* of $A$ is

$$
\begin{align*}
|A| := \inf \Bigg\{ \sum_{k \in \mathbb{N}} \ell(I_k) :
&\ I_k \text{ is an open interval for all } k \in \mathbb{N} \\
&\ \text{and } A \subseteq \bigcup_{k \in \mathbb{N}} I_k \Bigg\}.
\end{align*}
$$
///

/// definition | $\sigma$-Algebra
    attrs: {id: def-sigma_algebra}

Let $X$ be a set and let $\mathcal{S}$ be a set of subsets of $X$. Then $\mathcal{S}$ is a *$\sigma$-algebra* on $X$ if:

**(i)** $\varnothing \in \mathcal{S}$.

**(ii)** If $E \in \mathcal{S}$, then $E^c = X \setminus E \in \mathcal{S}$.

**(iii)** If $\{E_k : k \in \mathbb{N}\} \subseteq \mathcal{S}$, then

$$
\bigcup_{k \in \mathbb{N}} E_k \in \mathcal{S}.
$$

That is, $\mathcal{S}$ contains the empty set, is closed under complements, and is closed under countable unions.
///

/// definition | Measurable Space
    attrs: {id: def-measurable_space}

A *measurable space* $(X, \mathcal{S})$ is a set $X$ together with a $\sigma$-algebra $\mathcal{S}$ on $X$.
///

/// definition | Borel Set
    attrs: {id: def-borel_set}

The collection of *Borel subsets* of $\mathbb{R}$ is the smallest $\sigma$-algebra on $\mathbb{R}$ that contains all open subsets of $\mathbb{R}$.

A set $E \subseteq \mathbb{R}$ is *Borel* if $E$ is in this collection.
///

/// definition | Measurable Function
    attrs: {id: def-measurable_function}

Let $(X, \mathcal{S})$ be a measurable space. A function $f : X \to \mathbb{R}$ is *measurable* if

$$
f^{-1}(B) \in \mathcal{S}
$$

for every Borel set $B \subseteq \mathbb{R}$.
///

/// definition | Borel Measurable Function
    attrs: {id: def-borel_measurable_function}

Let $X \subseteq \mathbb{R}$. A function $f : X \to \mathbb{R}$ is *Borel measurable* if $f^{-1}(B)$ is Borel for every Borel set $B \subseteq \mathbb{R}$.
///

/// definition | Measure
    attrs: {id: def-measure}

Let $(X, \mathcal{S})$ be a measurable space. A function $\mu : \mathcal{S} \to [0, \infty]$ is a *measure* if:

**(i)** $\mu(\varnothing) = 0$.

**(ii)** For every disjoint sequence $\{E_k : k \in \mathbb{N}\} \subseteq \mathcal{S}$,

$$
\mu\left(\bigcup_{k \in \mathbb{N}} E_k\right) = \sum_{k \in \mathbb{N}} \mu(E_k).
$$
///

/// definition | Measure Space
    attrs: {id: def-measure_space}

A *measure space* $(X, \mathcal{S}, \mu)$ consists of a set $X$, a $\sigma$-algebra $\mathcal{S}$ on $X$, and a measure $\mu$ on $(X, \mathcal{S})$.
///

/// definition | Lebesgue Measure
    attrs: {id: def-lebesgue_measure}

*Lebesgue measure* is outer measure restricted to the Borel measurable space:

$$
(\mathbb{R}, \mathcal{B}, \mu), \qquad \mu = |\cdot|.
$$
///

/// definition | Lebesgue Measurable Set
    attrs: {id: def-lebesgue_measurable_set}

A set $A \subseteq \mathbb{R}$ is *Lebesgue measurable* if there exists a Borel set $B \in \mathcal{B}$ such that

$$
B \subseteq A
\quad \text{and} \quad
|A \setminus B| = 0.
$$
///

/// note | Sets of Outer Measure Zero

If $|A| = 0$, then

$$
|A \setminus \varnothing| = |A| = 0
\quad \text{and} \quad
\varnothing \subseteq A.
$$

Therefore $A$ is Lebesgue measurable.
///

Thus the Lebesgue measurable sets are Borel sets unioned with some set with outer measure $0$:

$$
A = B \cup (A \setminus B).
$$

Thus it is the smallest $\sigma$-algebra containing the Borel sets and sets with measure $0$; see Axler 2.72. Hence

$$
\mathcal{L} = \{A \subseteq \mathbb{R} : A \text{ is Lebesgue measurable}\}
$$

is a $\sigma$-algebra on $\mathbb{R}$.

/// note | Remark

Already have: countable implies outer measure zero, which implies Lebesgue measurable.

So if a set is not Lebesgue measurable, then it is not countable. We showed in Axler 2.81 that there exists a Lebesgue measurable set $A \subseteq [0,1]$ such that $|A| = 0$ and $\Delta(A)$ is not a Lebesgue measurable set. Hence $\Delta(A)$ is not countable.
///
