<!-- snippets: latex_math -->
# Luzin's Theorem

Numbered 2.91 in Axler.

Rewrote in my own words and scanned the notes to markdown. A personal exercise. 

/// theorem | Luzin Theorem [2.91]

- $g:\mathbb{R}\to\mathbb{R}$ Borel measurable.

Then $\forall \varepsilon>0$, $\exists$ closed $F\subseteq\mathbb{R}$ s.t. $|\mathbb{R}\setminus F|<\varepsilon$ & $g|_F$ continuous on $F$.
///

## Proof Idea

1. Prove Luzin for simple functions.
2. Apply Luzin to simple approximation.
3. Apply Egorov to get uniform continuity. Note Egorov need finite $(n,n+1)$.
4. Uniform limits preserve continuity.

## Proof

/// proof

### Proof on simple functions

Let

$$
g=\sum_{k=1}^n a_k\chi_{D_k}
$$

for distinct non zero $a_k\in\mathbb{R}$ & disjoint Borel $D_k\subseteq\mathbb{R}$.

By (2.71) Lebesgue equivalent definition $\exists$ open $G_k$, closed $F_k$ $\forall k\in\{1,\ldots,n\}$ s.t.

$$
F_k\subseteq D_k\subseteq G_k
$$

where

$$
|D_k\setminus F_k|<\frac{\varepsilon}{2n}
\quad\&\quad
|G_k\setminus D_k|<\frac{\varepsilon}{2n}.
$$

Then

$$
G_k\setminus F_k
=
(G_k\setminus D_k)\cup(D_k\setminus F_k)
$$

has $|G_k\setminus F_k|<\frac{\varepsilon}{n}$ $\forall k\in\{1,\ldots,n\}$. Let

$$
F:=
\left(\bigcup_{k=1}^n F_k\right)
\cup
\left(\bigcap_{k=1}^n \mathbb{R}\setminus G_k\right).
$$

Then $F$ closed subset of $\mathbb{R}$ &

$$
\mathbb{R}\setminus F
\subseteq
\bigcup_{k=1}^n G_k\setminus F_k.
$$

Latter because

$$
\begin{align*}
\mathbb{R}\setminus F
&=
\left(\bigcap_{k=1}^n \mathbb{R}\setminus F_k\right)
\cap
\left(\bigcup_{k=1}^n G_k\right) \\
[\text{distributivity}]
&=
\bigcup_{k=1}^n
\left(
\left(\bigcap_{j=1}^n \mathbb{R}\setminus F_j\right)
\cap G_k
\right) \\
&\subseteq
\bigcup_{k=1}^n
\left((\mathbb{R}\setminus F_k)\cap G_k\right) \\
&=
\bigcup_{k=1}^n G_k\setminus F_k.
\end{align*}
$$

Thus $|\mathbb{R}\setminus F|<\varepsilon$.

$F_k\subseteq D_k\Rightarrow g$ identically $a_k$ on $F_k\Rightarrow g|_{F_k}$ continuous.

$$
\bigcap_{k=1}^n \mathbb{R}\setminus G_k
\subseteq
\bigcap_{k=1}^n \mathbb{R}\setminus D_k
$$

$\Rightarrow g$ identically $0$ on $\bigcap_{k=1}^n\mathbb{R}\setminus G_k\Rightarrow g|_{\bigcap_{k=1}^n\mathbb{R}\setminus G_k}$ continuous.

Hence by Ex 9 (disjoint open continuity union is continuous) $g|_F$ is continuous.

### Apply Luzin to simple approximations

By simple approximation of measurable functions (2.89) $\exists g_k:\mathbb{R}\to\mathbb{R}$ $\forall k\in\mathbb{Z}^+$ that converges pointwise to $g$ where $g_k$ simple, Borel measurable.

By simple Luzin $\exists$ closed $C_k\subseteq\mathbb{R}$ s.t.

$$
|\mathbb{R}\setminus C_k|<\frac{\varepsilon}{2^{k+1}},
\qquad
g_k|_{C_k}\text{ continuous}
$$

$\forall k\in\mathbb{Z}^+$. Let

$$
C=\bigcap_{k=1}^{\infty}C_k.
$$

Thus $C$ is closed & $g_k|_C$ continuous $\forall k\in\mathbb{Z}^+$ &

$$
\mathbb{R}\setminus C
\subseteq
\bigcup_{k=1}^{\infty}\mathbb{R}\setminus C_k
\Rightarrow
|\mathbb{R}\setminus C|
\leq
\frac{\varepsilon}{2}.
$$

### Apply Egorov to each finite $(m,m+1)$, $n\in\mathbb{Z}$

For each $n\in\mathbb{Z}$ the sequence $g_k|_{(m,m+1)}$ converges pointwise to $g$.

Egorov gives Borel $E_m\subseteq(m,m+1)$ s.t. $g_k$ converges uniformly to $g$ on $E_m$ &

$$
|(m,m+1)\setminus E_m|
<
\frac{\varepsilon}{2^{|m|+3}}
\qquad
\forall m\in\mathbb{Z}.
$$

Then $g_k$ converges uniformly on $C\cap E_m$ to $g$. Since $g_k|_C$ is continuous the uniform limit in $C\cap E_m$, $g|_{C\cap E_m}$, is continuous by 2.84.

Let

$$
D=\bigcup_{m\in\mathbb{Z}} C\cap E_m.
$$

Then $g|_D$ is continuous because $C\cap E_m$ are subsets of disjoint open intervals & subsets of disjoint open intervals keep continuity.

Now just need to show $\mathbb{R}\setminus D$ arbitrarily small & then take arbitrarily small closed approximate $F$.

$$
\begin{align*}
\mathbb{R}\setminus D
&=
\bigcap_{n\in\mathbb{Z}}
\left(
(\mathbb{R}\setminus C)\cup(\mathbb{R}\setminus E_n)
\right) \\
&=
(\mathbb{R}\setminus C)
\cup
\left(
\bigcap_{m\in\mathbb{Z}}\mathbb{R}\setminus E_m
\right)
\qquad [\text{distributivity}].
\end{align*}
$$

$$
\bigcap_{m\in\mathbb{Z}}\mathbb{R}\setminus E_m
\subseteq
\mathbb{Z}
\cup
\left(
\bigcup_{m\in\mathbb{Z}}(m,m+1)\setminus E_m
\right).
$$

Hence,

$$
\mathbb{R}\setminus D
\subseteq
(\mathbb{R}\setminus C)
\cup
\mathbb{Z}
\cup
\left(
\bigcup_{m\in\mathbb{Z}}(m,m+1)\setminus E_m
\right).
$$

$$
\Rightarrow
|\mathbb{R}\setminus D|
<
\frac{\varepsilon}{2}+0+\frac{\varepsilon}{2}
=
\varepsilon.
$$

Then by equivalent of Lebesgue 2.65 $\exists$ closed $F\subseteq D$ s.t.

$$
|D\setminus F|
<
\varepsilon-|\mathbb{R}\setminus D|.
$$

Then,

$$
\mathbb{R}\setminus F
=
(\mathbb{R}\setminus D)\cup(D\setminus F)
$$

and so

$$
\begin{align*}
|\mathbb{R}\setminus F|
&\leq
|\mathbb{R}\setminus D|+|D\setminus F| \\
&<
|\mathbb{R}\setminus D|
+\varepsilon
-|\mathbb{R}\setminus D| \\
&=
\varepsilon.
\end{align*}
$$

$g|_D$ continuous $\Rightarrow g|_F$ continuous. $\blacksquare$
///
