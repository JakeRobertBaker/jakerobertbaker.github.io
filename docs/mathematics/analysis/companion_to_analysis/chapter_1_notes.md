<!-- snippets: latex_math -->

# Notes on Chapter 1

## FA

/// definition | The fundamental axiom of analysis
    attrs: {id: def-fundamental-axiom}

If $a_{n} \in \mathbb{R}$ for all $n \in \mathbb{N}$, $A \in \mathbb{R}$

- $a_{1}\leq a_{2}\leq a_{3} \leq \dots$
- $a_n < A$ for all $n \in \mathbb{N}$

Then there exists $a \in \mathbb{R}$ such that $a_n \to a$ as $n \to ∞ $
///

## Theorem 1.2.1 The Axiom of Archimedes

The result is trivial in $\mathbb{Q}$. The theorem is proving it in $\mathbb{R}$.

This theorem proves that there is no $\gimel>0$ in $\mathbb{R}$ such that,

$\frac{1}{n} > \gimel$ for all $n$ $\iff$ $\gimel$ is smaller than all strictly positive rationals.  

Suppose there exists such a $0<\gimel< \frac{1}{n}$ for all $n$.

Then by preservation of non strict inequality (Lemma 1.6 (vii)) $0<\gimel \leq l = 0$ which contradicts the axiom of Archimedes.

If the theorem was true in $\mathbb{Q}$ but not in $\mathbb{R}$ we would have this exotic $\gimel$.

## Exercises

In A0 we proved $0_{\mathbb{F}} < 1_{\mathbb{F}}$.

Let $n_{\mathbb{F}} = 1_{\mathbb{F}} + \dots + 1_{\mathbb{F}}$ n times.

In A1 we show by induction that $n_{\mathbb{F}} > 0_{\mathbb{F}}$ and therefore they are not equal.

This means that any ordered field $\mathbb{F}$ has characteristic $∞$.

We will then proceed to show that this characteristic of $∞$ means we contain a copy of the rationals.

### Some obvious facts

#### F1

$n_{\mathbb{F}} + m_{\mathbb{F}} = (n+m)_{\mathbb{F}}$ for any $n,m \in \mathbb{N}^+$

#### F2

$n_{\mathbb{F}} m_{\mathbb{F}} = (nm)_{\mathbb{F}}$ for any $n,m \in \mathbb{N}^+$ due to distributivity.

#### F3

For any $n \in \mathbb{N}^+$ we have
$$
-n_{\mathbb{F}}
= -(\overbrace{1_{\mathbb{F}} + \dots + 1_{\mathbb{F}} }^{n})
= \overbrace{-1_{\mathbb{F}} + \dots + -1_{\mathbb{F}}}^{n}
$$

Hence, for any $n,m \in \mathbb{N}^+$

$$
\begin{align*}
n_{\mathbb{F}} - m_{\mathbb{F}}
&= \overbrace{1_{\mathbb{F}} + \dots + 1_{\mathbb{F}} }^{n} +
   \overbrace{-1_{\mathbb{F}}+ \dots + -1_{\mathbb{F}}}^{m} \\
&= \begin{cases}
0_{\mathbb{F}}
&&\text{if } n=m \\
\overbrace{1_{\mathbb{F}} + \dots + 1_{\mathbb{F}}}^{n-m}
&= (n-m)_{\mathbb{F}}
&\text{ if } n>m \\
\overbrace{-1_{\mathbb{F}} + \dots + -1_{\mathbb{F}}}^{m-n}
&= -(m-n)_{\mathbb{F}}
&\text{ if } n < m
\end{cases}
\end{align*}
$$

### Exercise A3

Let $\tau : \mathbb{Z} \to \mathbb{F}$ by,

$$
\tau(n) = \begin{cases}
0_{\mathbb{F}} & \text{if } n = 0 \\
n_{\mathbb{F}} & \text{if } n > 0 \\
-(-n)_{\mathbb{F}} & \text{if } n < 0
\end{cases}
$$

#### i)

Show that the map is well defined, injective and

- $\tau \left( n+m \right) = \tau(n) + \tau(m)$
- $\tau \left( nm \right) = \tau(n) \tau(m)$
- $\tau(n) > 0_{\mathbb{F}}, \text{ whenever } n>0.$

for all $n,m \in \mathbb{Z}$.

The case definition is already well defined.

**Additive**

If one or more $n,m$ equal 0 then additivity is trivial. Therefore assume either both positive OR one positive and one negative OR both negative.

Both positive case is trivial:

$$
\tau(n) + \tau(m)
= n_{\mathbb{F}} + m_{\mathbb{F}} \overset{F1}{=}
(n+m)_{\mathbb{F}}
= \tau(n+m)
$$

One positive and one negative case.Assume WLOG $n>0$ and $m<0$.

$$
\tau(n) + \tau(m) \overset{\text{Def}}{=} n_{\mathbb{F}} + -(-m)_{\mathbb{F}} = (*)
$$

We can just apply F3 where $-m$ takes the role of $m$.

$$
(*) =
\begin{cases}
0_{\mathbb{F}}
&
& \overset{\text{Def }}{=} \tau(0)
&\text{ if } n=-m \\
(n--m)_{\mathbb{F}}
&= (n+m)_{\mathbb{F}}
& \overset{\text{Def }}{=} \tau(n+m)
&\text{ if } n>-m
\\
-(-m-n)_{\mathbb{F}}
&= -(-(n+m))_{\mathbb{F}}
& \overset{\text{Def }}{=} \tau(n+m)
&\text{ if } n < -m
\end{cases}
$$

**Multiplicative**

If one of $n,m$ is zero then it's easy to show $nm=0_{\mathbb{F}} = \tau(n) \tau(m)$.
Assume $n,m \neq 0$, therefore there are cases.

If $n,m>0$.

$$
\begin{align*}
\tau(n) \tau(m) \overset{\text{Def}}{=}
n_{\mathbb{F}} m_{\mathbb{F}} \overset{F2}{=} (nm)_{\mathbb{F}} \overset{\text{Def}}{=} \tau(nm)
\end{align*}
$$

If $n>0, m<0$,

$$
\begin{align*}
\tau(n) \tau(m)
&\overset{\text{Def}}{=} n_{\mathbb{F}} \times -(-m)_{\mathbb{F}}\\
[\text{algebra}] &= - (n_{\mathbb{F}} \times (-m)_{\mathbb{F}}) \\
[\text{F2}] &= -(n \times -m)_{\mathbb{F}} = -(-nm)_{\mathbb{F}} \\
[\text{Def}] &= \tau(nm)
\end{align*}
$$

If $n,m <0$,

$$
\begin{align*}
\tau(n) \tau(m)
&\overset{\text{Def}}{=} -(-n)_{\mathbb{F}} \times -(-m)_{\mathbb{F}} = (-n)_{\mathbb{F}} (-m)_{\mathbb{F}} \\
[\text{F2}] &= (-n \times -m)_{\mathbb{F}} = (nm)_{\mathbb{F}} \\
[\text{Def}] &= \tau(nm)
\end{align*}
$$

**Positive**
Easy since $\tau(n)=(n)_{\mathbb{F}}>0_{\mathbb{F}}$ by A2.

**Injective**

We have already shown that $n_{\mathbb{F}} \neq 0$ therfore $-n_{\mathbb{F}} \neq 0$ for any $n>0$. Therefore $\ker \tau = \left\{ 0 \right\}$.
Since $\tau$ is linear this is sufficient.

#### ii)

Define $\phi: \mathbb{Q} \to \mathbb{F}$ by $\phi(n/m) = \tau(n) \tau(m)^{-1}$

This function is well defined and has properties

- $\phi (x+y) = \phi(x) + \phi(y)$
- $\phi(xy) = \phi(x) \phi(y)$
- $\phi(x) > 0_{\mathbb{F}}$ whenever $x>0$

**Proof**

**Well Defined**

Let $x= \frac{n}{m} = \frac{\lambda n}{\lambda m}$ for some $\lambda \in \mathbb{N}$. Then,

$$
\begin{align*}
\phi\!\left(\frac{\lambda n}{\lambda m}\right)
&= \tau(\lambda n) \tau(\lambda m)^{-1} \\
&= \tau(\lambda) \tau(n) \bigl(\tau(\lambda) \tau(m)\bigr)^{-1} \\
&= \tau(\lambda) \tau(n) \tau(\lambda)^{-1} \tau(m)^{-1} \\
&= \tau(n) \tau(m) \\
&= \phi(x)
\end{align*}
$$

**Additive**

Let $x = \frac{n}{m}, y= \frac{p}{q}$ for $n,m,p,q \in \mathbb{Z}$

$$
\begin{align*}
\phi(x+y) &= \phi\!\left(\frac{nq + pm}{mq}\right) \\
&= \tau(nq + pm) \tau(mq)^{-1} \\
&= \tau(nq + pm) \tau(m)^{-1} \tau(q)^{-1} \\
&= \bigl( \tau(n) \tau(q) + \tau(p) \tau(m) \bigr) \tau(m)^{-1} \tau(q)^{-1} \\
&= \tau(n) \tau(m)^{-1} + \tau(p) \tau(q)^{-1} \\
&= \phi(x) + \phi(y)
\end{align*}
$$

We also see

$$
\begin{align*}
\phi(xy) &= \phi\!\left(\frac{np}{mq}\right) \\
&= \tau(n) \tau(p) \tau(m)^{-1} \tau(q)^{-1} \\
&= \tau(n) \tau(m)^{-1} \tau(p) \tau(q)^{-1} \\
&= \phi(x) \phi(y)
\end{align*}
$$

And we can assume $x>0$ means that $m,n>0$ since we can multiply both by $-1$ if not,

$$
\phi(x) = \tau(n) \tau(m)^{-1} >0_{\mathbb{F}}
$$

since A2 gives us $m>0 \implies \tau(m)>0$ which then implies it's inverse is positive (standard result).

### More obvious facts

#### F4

From definition,
$\phi(1) = \tau(1) \tau(1)^{-1} = 1_{\mathbb{F}}$

This can also be proved as a standard algebra result for homomorphisms.

#### F5

$\phi(-x) = -\phi(x)$, literally add them to get $\phi(0) \overset{\text{Def}}{=}0_{\mathbb{F}}$

#### F6

In A2 we proved $0 < x \in \mathbb{Q} \implies \phi(x) > 0$

The converse is straightforward by contrapositive. Assume $x\leq0$.

If $x=0$, then $\phi(0) \overset{\text{Def}}{=} 0$.

If $x<0$ then $\phi(-x) = -\phi(x)>0$ by forward direction that we proved.

Hence $\phi(x) \leq 0$.

Hence
$$
\phi(x) > 0_{\mathbb{F}} \iff x > 0
$$

#### F7

$$
\begin{align*}
\phi(x) > \phi(y) \iff \phi(x) - \phi(y) > 0_{\mathbb{F}} \iff \phi(x-y) > 0_{\mathbb{F}}
\overset{\text{F6}}{\iff} x-y > 0
\end{align*}
$$

#### F8 Axiom of Archimedes in general field

Let $a_n = \phi \left( \frac{1}{n} \right)$. This sequence is bounded and decreasing (F7) and therefore converges by FA, call this limit $l$.

Let

$$
\begin{align*}
b_n &= \phi \left( \frac{1}{2} \right) \phi \left( \frac{1}{n} \right) = \phi \left( \frac{1}{2} \right) a_n \to
\phi \left( \frac{1}{2} \right) l
\\
& \text{ by Algebra of Limits, Lemma 1.6 }
\\
&= \phi \left( \frac{1}{2n} \right) = a_{2n} \to l
\\
& \text{by subsequence.}
\end{align*}
$$

Hence,

$$
\begin{align*}
l = \phi \left( \frac{1}{2} \right) l
&\iff
\left( 1_{\mathbb{F}} - \phi \left( \frac{1}{2} \right) \right)l = 0
\\
&\iff
\phi \left( \frac{1}{2} \right) l = 0
\\
&\iff
l=0
\end{align*}
$$

Basically the same as before!

#### F9

For any $x \in \mathbb{F}$ there exists $n_{\mathbb{F}} \in \phi(\mathbb{Z}) \colon x< n_{\mathbb{F}}$.

**i $x \leq 0_{\mathbb{F}}$ is trivial**, $n=1$ does the job.

**ii assume $x > 0_{\mathbb{F}}$.**

By Archimedes there exists $n \in \mathbb{N}$ such that
$$
0_{\mathbb{F}} < \phi \left( \frac{1}{n} \right) < \frac{1}{x}
\iff
\phi ( n ) = n_{\mathbb{F}} > x > 0_{\mathbb{F}}
$$

#### F10

For any $x \in \mathbb{F}$ there exists $n_{\mathbb{F}}$ such that $n-1 \leq x_{\mathbb{F}} \leq n_{\mathbb{F}}$

Apply F8 to $x$ and $-x$ to get $a_{\mathbb{F}} < x < b_{\mathbb{F}}$ for some $a,b \in \mathbb{Z}$.

Let $n=b$, if $x < (n-1)_{\mathbb{F}}$ let $n \colon = n-1$, repeat...

This terminates eventually since $x<a_{\mathbb{F}}$ is not possible. Termination occurs when $x \geq \mathbb{n-1}$

### Exercise A4

Let $\mathbb{K} = \phi \left( \mathbb{Q} \right) \subseteq \mathbb{F}$.

Prove that if $x \in \mathbb{F}$ then there exists sequence $x_n \in \mathbb{K}$ such that $x_1 \leq x_2 \leq \dots$ such that $x_n \to x$ as $n \to \infty$.

**Proof**
By F9 there exists $a,b \in \phi(\mathbb{Z})$ such that $a \leq x<b$.

Let $a_0, b_0 = a,b$. Then let $c_i = \phi \left( \frac{1}{2} \right)  \left( a_{i-1} + b_{i-1} \right)$

$$
\begin{cases}
a_i &= c_i
& \text{ and }
b_i = b_{i-1}
& \text{ if } c_i \leq x
\\
a_i &= a_{i-1}
& \text{ and }
b_i = c_i
& \text{ if } x_i > x
\end{cases}
$$

Therefore, $b_i - a_i = \phi\left( \frac{1}{2} \right)^n \left( b_0 - a_0 \right) \to 0_{\mathbb{F}}$.

Note, this is due to exercise $a^n \to 0$ for $\lvert a \rvert < 1_{\mathbb{F}}$ generalising by generalising Axiom of Archimedes (TODO).

We also have that $a_n, b_n$ are bounded and non strictly monotonic and therefore converge by FA. Therefore they converge to the same limit $l \in \mathbb{F}$.

We have preservation of non strict inequality give $a_n \leq x < b_n \implies l \leq x \leq l$ and hence $x=l$.
