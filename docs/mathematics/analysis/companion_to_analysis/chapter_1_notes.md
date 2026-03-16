<!-- snippets: latex_math -->

# Notes on Chapter 1

/// definition | The fundamental axiom of analysis
    attrs: {id: def-fundamental-axiom}

If $a_{n} \in \mathbb{R}$ for all $n \in \mathbb{N}$, $A \in \mathbb{R}$

- $a_{1}\leq a_{2}\leq a_{3} \leq \dots$
- $a_n < A$ for all $n \in \mathbb{N}$

Then there exists $a \in \mathbb{R}$ such that $a_n \to a$ as $n \to ∞ $
///

## Theorem 1.2.1 The Axiom of Archimedes

The result is trivial in $\mathbb{Q}$. The theorem is proving it in $\mathbb{R}$.

If the theorem was true in $\mathbb{Q}$ but not in $\mathbb{R}$ we would therefore have some exotic real number that is smaller than all strictly positive rationals like $\frac{1}{n}$ but still larger than 0.

Hence the need for this Theorem.

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
n_{\mathbb{F}} - m_{\mathbb{F}} =
\overbrace{1_{\mathbb{F}} + \dots + 1_{\mathbb{F}} }^{n} +
\overbrace{-1_{\mathbb{F}}+ \dots + -1_{\mathbb{F}}}^{m} =
\begin{cases}
0_{\mathbb{F}}
&&\text{if } n=m \\
\overbrace{1_{\mathbb{F}} + \dots + 1_{\mathbb{F}}}^{n-m}
&= (n-m)_{\mathbb{F}}
&\text{ if } n>m
\\
\overbrace{-1_{\mathbb{F}} + \dots + -1_{\mathbb{F}}}^{m-n}
&= -(m-n)_{\mathbb{F}}
&\text{ if } n < m
\end{cases}
$$

### Exercise A3

Let $\tau : \mathbb{Z} \to \mathbb{F}$ by,

If $n=0$ then $\tau(n) = 0_{\mathbb{F}}$

If $n>0$ then $\tau(n) = n_{\mathbb{F}}$

If $n < 0$ then $\tau(n) = - \left( -n \right)_{\mathbb{F}}$

#### i)

Show that the map is well defined, injective and

$$
\tau \left( n+m \right) = \tau(n) + \tau(m)
\\
\tau \left( nm \right) = \tau(n) \tau(m)
\\
\tau(n) > 0_{\mathbb{F}}, \text{ whenever } n>0.
$$

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
\phi(\frac{\lambda n}{\lambda m})
= \tau(\lambda n) \tau(\lambda m)^{-1}
\\
= \tau(\lambda) \tau(n) (\tau(\lambda) \tau(m))^{-1}
\\
= \tau(\lambda) \tau(n) \tau(\lambda)^{-1} \tau(m)^{-1}
\\
= \tau(n) \tau(m)
\\
= \phi(x)
$$

**Additive**

Let $x = \frac{n}{m}, y= \frac{p}{q}$ for $n,m,p,q \in \mathbb{Z}$

$$
\phi(x+y) = \phi(\frac{nq + pm}{mq})
\\
= \tau(nq + pm) \tau(mq)^{-1}
\\
= \left( \tau(n) \tau(q) + \tau(p) \tau(m) \right) \tau(m)^{-1} \tau(q)^{-1}
\\
= \tau(n) \tau(m)^{-1} + \tau(p) \tau(q)^{-1}
\\
= \phi(x) + \phi(y)
$$

We also see

$$
\phi(xy) = \phi(\frac{np}{mq}) \\
= \tau(n) \tau(p) \tau(m)^{-1} \tau(q)^{-1} \\
= \tau(n) \tau(m)^{-1} \tau(p) \tau(q)^{-1} \\
= \phi(x) \phi(y)
$$

And we can assume $x>0$ means that $m,n>0$ since we can multiply both by $-1$ if not,

$$
\phi(x) = \tau(n) \tau(m)^{-1} >0_{\mathbb{F}}
$$

since A2 gives us $m>0 \implies \tau(m)>0$ which then implies it's inverse is positive (standard result).
