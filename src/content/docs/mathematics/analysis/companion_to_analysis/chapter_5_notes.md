---
title: Chapter 5
contentsBlocks: all
---

## Series Convergence Results
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

### Exercise 5.21

:::exercise[Non Absoloutely Convergent Sums have any limit]{#ex-non-absoloutely-convergent-sums-have-any-limit n=5.21 book=Korner}

Suppose that $\sum_{j=1}^{\infty} a_{j}$ is convergent but not absolutely convergent. 

Let $l \in \mathbb{R}$ and,

$$
\begin{align*}
S(0) &= \left\{ n \in \mathbb{N} : a_n < 0 \right\}, &
T(0) &= \left\{ n \in \mathbb{N} : a_n \geq 0 \right\}
\end{align*}
$$

We then inductively define $\sigma : \mathbb{N} \to \mathbb{N}$ for each $n \in \mathbb{N}$,

let $\tilde{S}_{n} \coloneqq \sum_{j=1}^{n} a_{\sigma(j)}$ , $\tilde{S}_{\infty} \coloneqq \lim_{n \to \infty} \tilde{S}_{n}$
and $\tilde{S}_{0} \coloneqq 0$,

$$
\begin{align*}
\text{ if } \tilde{S}_{n-1} < l
\\
\sigma \left( n \right) & \coloneqq \min T \left( n-1 \right),
& T(n) & \coloneqq T(n-1) \setminus \left\{ \sigma(n) \right\},
& S(n) & \coloneqq S(n-1)
\\
\text{ if } \tilde{S}_{n-1} \geq l
\\
\sigma \left( n \right) & \coloneqq \min S \left( n-1 \right),
& T(n) & \coloneqq T(n-1),
& S(n) & \coloneqq S(n-1) \setminus \left\{ \sigma(n) \right\}
\end{align*}
$$

In other words if the sum is above $l$ pick the next negative term and vice versa.
:::

:::solution{proves="#ex-non-absoloutely-convergent-sums-have-any-limit"}

### [ii] $\sigma$ is a permutation

#### Solution

Because neither $S_{n}^{+}$ or $S_{n}^{-}$ converge there are infinitely many terms such that $a_{j}^{+}$ and $a_{j}^{-}$ are non zero. Therefore both $S(0), T(0)$ are infinite and the construction is able to pick $\sigma(n)$ at each stage.


### [iii]

Let $n \in \mathbb{N}$, if, 

- $\kappa > |a_r|$ for all $r \in S(n) \cup T(n)$
- $m > n$ and $S(m) \neq S(n)$, $T(m) \neq T(n)$

show that $|\sum_{j=1}^{m} a_{\sigma(j)} - l| < \kappa$. 

(It may be helpful to consider what happens when $\sum_{j=1}^{m} a_{\sigma(j)} - l$ changes sign.)

#### Solution

$S(m) \neq S(n)$, $T(m) \neq T(n)$ 

$\iff$

there exists $k$ such that $n<k<m$ and $a_{\sigma(k)}, a_{\sigma(k+1)}$ have different sign.

Let $k$ be the greatest interger less than $m$ where this occurs.

Assume that $\hat{S}_k \geq l$. The $<l$ case is a very similar proof.

Therefore by sign change $\hat{S}_{k-1} < l$

Notice that 

$S(n) \cup T(n) = \mathbb{N} \setminus \left\{ \sigma(1), \dots \sigma(n) \right\} = \left\{ \sigma(n+1), \sigma(n+2), \dots \right\}$

There are then two sub cases to consider:

##### Case 1
$\hat{S}_{k+1} > l$

![Diagram](tikz_series_plot_variant_above.svg)

$\hat{S}_{k-1} < l$

$\implies   \hat{S}_{k-1} + a_{\sigma(k)} < l + a_{\sigma(k)} \implies \hat{S}_{k} - l < a_{\sigma(k)}$

So $0 \leq S_{k} -l < a_{\sigma(k)}$

Because $k$ is the last integer $<m$ where $a_{\sigma(k)}, a_{\sigma(k+1)}$ have different signs, it holds that $a_{\sigma(j)} > 0$ for all $j \in \left\{ k+1, \dots, m \right\}$.

So $0 \leq \hat{S}_{j} - l \leq \hat{S}_{k} - l < a_{\sigma(k)}$ for all $j \in \left\{ k+1, \dots, m \right\}$


##### Case 2
$\hat{S}_{k+1} \leq l$

![Diagram](tikz_series_plot_variant_below.svg)
:::

## Exponential Function

:::definition[Exponential function]{#def-e-z}

Define $e : \mathbb{C} \to \mathbb{C}$ by
$$
e(z) = 
\sum_{j=0}^{\infty} \frac{z^{j}}{j!}
$$
:::

:::lemma[e has $\infty$ radius of convergence]{#lem-e-has-infty-radius-of-convergence n=5.36 book=Korner}
The series $e(z)$ converges $\forall \ z \in \mathbb{C}$.
:::

Poof is easy via the ratio test.

:::lemma[e is multiplicative]{#lem-e-is-multiplicative}
$$
\forall \ z,w \in \mathbb{C} \\
e(z+w) = e(z) + e(w)
$$
:::

The proof is note too hard. It uses the earlier results about swapping triangles and squares [Korner Lemma 5.27] that union to the same set.

[Korner Ex 5.38] was a good example of a more general result to use in proving the above lemma.

Some manual bookwork...

:::proposition[$e(z)\neq0$]{#prp-e-z-neq0}
$e : \mathbb{C} \to \mathbb{C} \setminus \left\{ 0 \right\}$
:::

:::proof{proves="#prp-e-z-neq0"}
We know that $e(0)=1$.

Suppose $e( \omega ) = 0$.

Then $e(0) = e(\omega + - \omega) = e(\omega) e(-\omega) = 0 e(-\omega) = 0$. Contradiction.
:::

Korner states a helpful error bound on the finite series. I shall rewrite in my own words as a personal exercise.

:::lemma[Remainder Bound]{#lem-remainder-bound n=5.42 book=Korner}
If $|z| < n/2$, then

$$
\left| e(z) - \sum_{j=0}^{n-1} \frac{z^j}{j!} \right|
\leq \frac{2 |z|^n}{n!}
$$
:::

:::proof{proves="#lem-remainder-bound"}
See that
$$
\begin{align*}
\left| e(z) - \sum_{j=0}^{n-1} \frac{z^j}{j!} \right| =
\left| \sum_{j=n}^{\infty} \frac{z^j}{j!} \right|
& \leq \sum_{j=n}^{\infty} \frac{|z|^j}{j!}
\\ &=
\sum_{k=0}^{\infty} \frac{|z|^n}{n!} \frac{|z|^k}{(n+1)(n+1)\dots (n+k)} 
\\ &\leq
\sum_{k=0}^{\infty} \frac{|z|^n}{n!} \frac{|z|^k}{(n+1)^k}
\\ &=
\frac{|z|^n}{n!} \frac{1}{1-\frac{|z|}{n+1}} 
\\ &=
\frac{|z|^n}{n!} \frac{n+1}{n+1 - |z|}
\end{align*}
$$

Notice that since $|z| < n/2$ we have that

$$
n+1 - |z| > n/2 + 1
$$

Therefore

$$
\frac{n+1}{n+1-|z|} < \frac{n+2}{n/2 + 1} = 2
$$

And so,

$$
\left| e(z) - \sum_{j=0}^{n-1} \frac{z^j}{j!} \right| < 2 \frac{z^n}{n!}
$$
:::

:::exercise[$e : \mathbb{R} \to \mathbb{R}$ properties]{#ex-real-e-properties}
(i) TODO
:::

:::solution{proves="#ex-real-e-properties"}
#### (i)

Let $z=h, n=2$ in [Lemma 5.42](#lem-remainder-bound) and let $e_m(z)$ denote the sum of the first $m$ terms.

So, for $|h| < 1$

$$
\begin{align*}
\left| e(h) - e_{1}(h) \right| &< 2 h^2 / 2
\\
\left| e(h) - 1 - h \right| &< h^2
\end{align*}
$$

We see that the derivative quotient minus 1 is

$$
\left| \frac{e(0+h) - e(0)}{h} - 1 \right|
=
\frac{1}{|h|} \left| e(h) - 1 - h \right| < |h|
$$

for $|h| < 1$

Hence $e'(0)=1$

#### (ii)

Multiplicative rule gives

$$
e(x+h) - e(x) = e(x)e(h) - e(x) = e(x) \left( e(h) - 1 \right)
$$

Hence the derivative quotient minus $e(x)$ is

$$
\begin{align*}
\left| \frac{e(x+h) - e(x)}{h} - e(x)  \right|
&=
\left| e(x) \right|
\left| \frac{e(h) - 1}{h} - 1 \right|
\\
\text{[by the previous bound]} &<
\left| e(x) \right| |h|
\end{align*}
$$

This difference can be arbitrarily small as $h\to 0$ and $e(x)$ is fixed. Hence the derivative at $x$ is $e(x)$.

#### (iii)

If $x\geq 0$ then $e_N(x) = \sum_{j=0}^{N} \frac{x^j}{j!} \geq 1$ for all $N \in \mathbb{N}$.

$$
e(x) = \lim_{N \to \infty} e_N(x) \geq 1
$$

We already showed $e(x) \neq 0$ so $e(x)e(-x)=1$ gives us that $e(-x) = \frac{1}{e(x)}$.

If $x\geq 0$ we have that $e(x) > 0$ therefore $e(-x) = \frac{1}{e(x)}$ > 0. Hence both non negative and negative $x$ have $e(x) > 0$. 

#### (iv)

Since $e'(x) = e(x) > 0$ then
[Lemma 1.48 (positive derivatives imply monotonic)](chapter_1_notes.md#lem-strict-increasing-derivative)
gives us that $e$ is strictly increasing.

#### (v)

$$
e_N(x) = 1 + x + \sum_{j=2}^{N} \frac{x^j}{j!} > x
\ \forall x\geq 0
$$

Taking limit $N\to \infty$ gives

$$
e(x) \geq x \ \forall x\geq 0
$$

Hence $\forall K \in \mathbb{R} \ \exists X \in R$ such that $e(x) > K$ for all $x > X$. Taking $X=K+1$ and noting that $e$ is strict monotonic is enough.

Hence $e(x) \to \infty$ as $x\to \infty$

#### (vi)

Let $y>0$.

We have that $e$ is continuous via $e$ everywhere differentiable.

We have that $e(y+1) > y$ 

and $e(1/y + 1) > 1/y \iff y > e(-1/y -1)$ 

Hence by intermediate value theorem there exists $c$ between $-1/y-1$ and $y+1$ such that $e(c) = y$

#### (vii)

We have already showed that the image of $e$ is $\mathbb{R}^{++}$ in (iii).

We have just shown that $e$ surjects onto that image in part (iv).

It is a fundamental [fact](chapter_1_notes.md#fundamental-facts) that a strict monotonic implies injective.

Hence $e: \mathbb{R} \to \mathbb{R}^{++}$ bijects.

#### (viii)

Let's consider polynomial $P(x) = \sum_{j=0}^{M} a_j x^{j}$. If $x>1$ then,

$$
\left| P(x) \right| \leq \left| \sum_{j=0}^{M} \left| a_j \right| x^j \right|
\leq b x^M
$$

for $b \coloneqq \sum_{j=0}^{M} |a_j|$.

Also, still assuming $x\geq 1$ we have that for $N>M+2$,

$$
e_N(x) = 1 + \dots + \frac{x^{M+1}}{(M+1)!} + \sum_{j=M+2}^{N} \frac{x^j}{j!} > \frac{x^{M+1}}{(M+1)!}
$$

Therefore

$$
e(x) = |e(x)| \geq \frac{x^{M+1}}{(M+1)!}
$$

Then,

$$
\left| \frac{e(x)}{P(x)} \right| \geq \frac{1}{b x^{M}} \frac{x^{M+1}}{(M+1)!} = \frac{x}{b (M+1)!}
$$

Hence $\left| \frac{e(x)}{P(x)} \right| \to \infty$ as $x \to \infty$.

Hence $\left| \frac{P(x)}{e(x)} \right| \to 0$ as $x \to \infty$

#### (ix)

Assume that $e(x) = \frac{P(x)}{Q(x)}$.

Then,

$$
\left| \frac{P(x)}{e(x)} \right| = \left| Q(x) \right| \geq q_M \left| x \right|^M \to \infty \text{ as } x\to \infty
$$

Which contradicts (viii). Hence e is not equal to any polynomial fraction.

:::

## Lemma 5.60 Proof Note

$y=f(x)$, $ k(h) \coloneqq f(x+h) - f(x) $

$$
\begin{align*}
\frac{g(f(x+h)) - g(f(x))}{f(x+h) - f(x)} &=
\frac{g(y + k(h))}{k(h)}
\end{align*}
$$

See [composition of limits](chapter_4_notes.md#lem-compose-limits) in Chapter 4.

The key idea is to use the fact that $k(h) \to 0$ as $h\to0$

:::exercise[One-dimensional inverse function theorem]{#ex-one-dimensional-inverse-function-theorem n=5.66 book=Korner}
Suppose,
- $f : \left[ a,b \right] \to \left[ c,d \right]$ is continuous
- $f$ is differentiable on $\left( a,b \right)$ 
- $f'(x) > 0 \forall x \in \left( a,b \right)$
- $f(a)=c, f(b)=d$

Show,
-  $f$ is a bijection 
- $f^{-1}: \left[ c,d \right] \to \left[ a,b \right]$ is continuous
- $f^{-1}$ is differentiable on $\left( c,d \right)$ with 

$$
\left( f^{-1} \right)'(x) = \frac{1}{f'(f^{-1}(x))}
$$
:::

:::solution{proves="#ex-one-dimensional-inverse-function-theorem"}
$f$ is strictly increasing due to [1.48 extension](chapter_1_notes.md#lem-strict-increasing-derivative). This uses the mean value inequality.


Because [strictly increasing continuity makes bijection](chapter_1_notes.md#lem-strict-cont-bijection) $f: [a,b] \to [c,d]$ is a bijection. This uses the intermediate value theorem.

If $f(x) < f(y)$ then $x \neq y$. If $x>y$ then $f(x) > f(y)$, contradiction. Hence $x < y$. So $f^{-1}$ is strict increasing.

#### $f^{-1}$ is continuous

<img src="/mathematics/analysis/companion_to_analysis/ex_5_66_inverse_continuity_sketch.svg" alt="Sketch: an interval of radius epsilon around x_0 on the left, and on the right the interval from f(x_0 - epsilon) to f(x_0 + epsilon) around y_0 = f(x_0)" width="80%">

Let $\varepsilon > 0$, $y_0 \in [c,d]$. Bijection gives unique $x_0 \in [a,b]$ such that $f(x_0) = y_0$.

If $y \in [c,d]$ then $f^{-1}$ strict increasing gives

$$
f(x_0 - \varepsilon) < y < f(x_0 + \varepsilon) \implies x_0 - \varepsilon < f^{-1}(y) < x_0 + \varepsilon.
$$

Let $\delta = \min\{ f(x_0+\varepsilon) - f(x_0),\ f(x_0) - f(x_0-\varepsilon) \}$.

Then

$$
|y - y_0| < \delta \implies f(x_0-\varepsilon) < y < f(x_0+\varepsilon) \implies x_0 - \varepsilon < f^{-1}(y) < x_0 + \varepsilon.
$$

Hence $f^{-1}$ is continuous.

#### $f^{-1}$ is differentiable

Let $g=f^{-1}$ and $k(h) \coloneqq g(x+h) - g(x)$

$$
\frac{g(x+h) - g(x)}{h} =
\frac{g(x+h)-g(x)}{f(g(x+h)) - f(g(x))} =
\frac{k}{f(k+g(x)) - f(g(x))}
$$

Because $f$ is differentiable on $(a,b)$ with non zero derivative and the quotient is non zero for positive $h$, this fraction has a well defined limit as $k \to 0$.

By the [composition of limits](chapter_4_notes.md#lem-compose-limits) this tends towards

$$
\frac{1}{f'(g(x))}
$$
.
:::
