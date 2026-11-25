---
title: Chapter 2 - Notes
tableOfContents:
  maxHeadingLevel: 4
---

Rewrote in my own words and scanned the notes to markdown. A personal exercise. 

## Union of Open Intervals Sharing a Point

:::lemma[Union of open intervals sharing a point is an open interval]{#lem-union_open_intervals_sharing_point}
Let $t\in\mathbb{R}$,

- $\mathcal{C}_t \subseteq \{I\mid I\text{ an open interval},\ t\in I\}$
- $\displaystyle G_t:=\bigcup_{I\in\mathcal{C}_t}I$

Then $G_t$ is an open interval.
:::

:::proof
Let,

$$
\begin{aligned}
a&=\inf\{u\mid(u,v)\in\mathcal{C}_t\text{ for some }v\in\mathbb{R}\} \\
b&=\sup\{v\mid(u,v)\in\mathcal{C}_t\text{ for some }u\in\mathbb{R}\}.
\end{aligned}
$$

Then $G_t=(a,b)$. By proof below. Note $a\leq u<t<v\leq b$ $\forall(u,v)\in\mathcal{C}_t$.

$\supseteq$: S'pose $x\in(a,b)$.

If $x=t$ then $x\in I$ $\forall I\in\mathcal{C}_t$ so $x\in G_t$.

If $x<t$ then $a<x<t<b$. Since $a$ is the greatest lower bound $x$ cannot be. So $\exists(u,v)\in\mathcal{C}_t$ s.t. $u<x$. So $u<x<t<v$. Hence $x\in(u,v)$.

If $x>t$ then $a<t<x<b$. Similarly $b$ supremum means $\exists(u,v)\in\mathcal{C}_t$ s.t. $v>x$. So $u<t<x<v<b$. So $x\in(u,v)$.

In both cases $x\in I$, some $I\in\mathcal{C}_t$ so $x\in G_t$.

$\subseteq$: S'pose $x\in G_t$.

Then $x\in(u,v)$ for some $(u,v)\in\mathcal{C}_t$.

Clearly $a\leq u$ & $v\leq b$ & therefore $(u,v)\subseteq(a,b)$ so $x\in(a,b)$.
:::

Note. The fundamental axiom is the key ingredient above.

## Intersection of $\sigma$-Algebras

[easy but an important point].

:::lemma[Axler Lemma 2.27]{#lem-sigma_algebra_intersection}
S'pose,

- $X$ a set
- $\mathcal{A}$ a set of subsets of $X$

Then, the intersection of all $\sigma$-algebras that contain $\mathcal{A}$ is a $\sigma$-algebra on $X$.
:::

:::proof
Let,

$$
\mathcal{N}:=\bigcap_{\mathcal{S}\in\mathcal{C}}\mathcal{S},\qquad \mathcal{C}:=\{\mathcal{S}:\mathcal{S}\text{ is a }\sigma\text{-algebra on }X,\ \mathcal{A}\subseteq\mathcal{S}\}
$$

Closure rules.

(i)

$\varnothing\in\mathcal{N}$ since $\varnothing\in\mathcal{S}$ $\forall\mathcal{S}\in\mathcal{C}$.

(ii)

$$
E\in\mathcal{N}\iff E\in\mathcal{S}\ \forall\mathcal{S}\in\mathcal{C}\implies X\setminus E\in\mathcal{S}\ \forall\mathcal{S}\in\mathcal{C}\iff X\setminus E\in\mathcal{N}.
$$

(iii)

$$
\begin{aligned}
\{E_k:k\in\mathbb{N}\}\subseteq\mathcal{N}&\implies\{E_k:k\in\mathbb{N}\}\subseteq\mathcal{S}\ \forall\mathcal{S}\in\mathcal{C} \\
&\implies\bigcup_{k\in\mathbb{N}}E_k\in\mathcal{S}\ \forall\mathcal{S}\in\mathcal{C} \\
&\implies\bigcup_{k\in\mathbb{N}}E_k\in\mathcal{N}.
\end{aligned}
$$

There exists at least one $\mathcal{S}\in\mathcal{C}$, $\mathcal{P}(X)\in\mathcal{C}$.
:::

## Egorov's Theorem

:::theorem[Egorov's Theorem]{#thm-egorov}
S'pose,

- $(X,\mathcal{S},\mu)$ measure space.
- $\mu(X)<\infty$
- $(f_k)_{k\in\mathbb{N}}$ sequence of $\mathcal{S}$ measurable $X\to\mathbb{R}$ that converges pointwise to $f:X\to\mathbb{R}$

Then, $\forall\varepsilon>0$ $\exists E\in\mathcal{S}$ s.t. $\mu(X\setminus E)<\varepsilon$ & $(f_k)$ converges uniformly to $f$ on $E$.
:::

### Proof Idea

Use pointwise convergence to write $X$ as union of $x$ that satisfy a bound for a particular $\varepsilon=\frac{1}{n}$.

Fix $n\in\mathbb{N}$, $A_{mn}$ is the set of $x$ that satisfy the bound $\forall k\geq m$.

$$
A_{mn}:=\bigcap_{k=m}^{\infty}\left\{x:|f_k(x)-f(x)|<\frac{1}{n}\right\}
$$

Then pointwise convergence gives us that all $x$ have some $m$ s.t. the bound holds $\forall k\geq m$. i.e. all $x\in A_{mn}$, some $m$. So

$$
\bigcup_{m=1}^{\infty}A_{mn}=X \tag{2.86}
$$

$X$ finite & 2.59 [measure of increasing union] gives $\displaystyle\lim_{m\to\infty}\mu(A_{mn})=\mu(X)$.

Then $\exists m_n$ s.t.

$$
\mu(X)-\mu(A_{m_n n})<\frac{\varepsilon}{2^n}. \tag{2.87}
$$

If we intersect $A_{m_n n}$ $\forall n\in\mathbb{N}$ we have made the size $\mu(X\setminus E)$ small by (2.87) & can show uniform convergence.

$$
\begin{align*}
\mu(X\setminus E)
&=\mu\left(X\setminus\bigcap_{n=1}^{\infty}A_{m_n n}\right) \\
&=\mu\left(\bigcup_{n=1}^{\infty}(X\setminus A_{m_n n})\right) \\
&\leq\sum_{n=1}^{\infty}\mu(X\setminus A_{m_n n}) \\
&<\sum_{n=1}^{\infty}\frac{\varepsilon}{2^n}=\varepsilon
\end{align*}
$$

**Note:** $f_k-f$ is $\mathcal{S}$ measurable by 2.48 [limit of $\mathcal{S}$ measurable] & 2.46 [algebra of measurable functions], therefore

$$
\left\{x:|f_k(x)-f(x)|<\frac{1}{n}\right\}=(f_k-f)^{-1}\left(\left(-\frac{1}{n},\frac{1}{n}\right)\right)\in\mathcal{S}
$$

so $A_{mn}\in\mathcal{S}$.

Then 2.57 [measure preserve order & set difference] or even just the fact that measures are countably additive on $\mathcal{S}$ gives $\mu(X\setminus A_{m_n n})=\mu(X)-\mu(A_{m_n n})$ which is used above.

Can show uniform convergence on $E$. Let $\varepsilon'>0$. Take $n$ s.t. $\frac{1}{n}<\varepsilon'$. Then $E\subseteq A_{m_n n}$ therefore $\forall x\in E$

$$
|f_k(x)-f(x)|<\frac{1}{n}<\varepsilon'\quad\forall k\geq m_n.
$$

## Luzin's Theorem

Numbered 2.91 in Axler.

:::theorem[Luzin Theorem [2.91]]

- $g:\mathbb{R}\to\mathbb{R}$ Borel measurable.

Then $\forall \varepsilon>0$, $\exists$ closed $F\subseteq\mathbb{R}$ s.t. $|\mathbb{R}\setminus F|<\varepsilon$ & $g|_F$ continuous on $F$.
:::

### Proof Idea

1. Prove Luzin for simple functions.
2. Apply Luzin to simple approximation.
3. Apply Egorov to get uniform continuity. Note Egorov need finite $(n,n+1)$.
4. Uniform limits preserve continuity.

### Proof

:::proof

#### Proof on simple functions

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

#### Apply Luzin to simple approximations

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

#### Apply Egorov to each finite $(m,m+1)$, $n\in\mathbb{Z}$

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
:::
