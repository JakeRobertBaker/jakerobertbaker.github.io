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

Let's refer to this as Fact 1, F1.

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
\tau(n) > 0_{\mathbb{F}}, \text{ whenever} n>0.
$$

The case definition is already well defined.

**Injective**

Assume $\tau(n) = \tau(m)$. WLOG assume $n \geq m$.

Assume for contradiction that $n>m$.

Then

$$
\begin{align*}
0_{\mathbb{F}} &= \tau(n) - \tau(m) \\
&= \overbrace{1_{\mathbb{F}} + \cdots + 1_{\mathbb{F}}}^{n} - \overbrace{1_{\mathbb{F}} + \cdots + 1_{\mathbb{F}}}^{m} \\
&= \overbrace{1_{\mathbb{F}} + \cdots + 1_{\mathbb{F}}}^{n-m} \quad (n - m \text{ positive}) \\
&= (n-m)_{\mathbb{F}} > 0_{\mathbb{F}}
\end{align*}
$$

Contradiction. Therefore $n$ must equal $m$

**Additive**

If one or more $n,m$ equal 0 then additivity is trivial. Therefore assume either both positive OR one positive and one negative OR both negative.

Both positive case is trivial:

$$
\tau(n) + \tau(m) = \overbrace{1_{\mathbb{F}} + \cdots + 1_{\mathbb{F}}}^{n} + \overbrace{1_{\mathbb{F}} + \cdots + 1_{\mathbb{F}}}^{m} = \overbrace{1_{\mathbb{F}} + \cdots + 1_{\mathbb{F}}}^{n+m} = \tau(n+m)
$$

Assume WLOG $n>0$ and $m<0$

**Case $n > -m$** (so $n+m > 0$):

$$
\begin{align*}
\tau(n) + \tau(m) &= \overbrace{1_{\mathbb{F}} + \cdots + 1_{\mathbb{F}}}^{n} - \overbrace{1_{\mathbb{F}} + \cdots + 1_{\mathbb{F}}}^{-m} \\
&= \overbrace{1_{\mathbb{F}} + \cdots + 1_{\mathbb{F}}}^{n+m} = (n+m)_{\mathbb{F}} = \tau(n+m)
\end{align*}
$$

**Case $n < -m$** (so $n+m < 0$):

$$
\begin{align*}
\tau(n) + \tau(m) &= \overbrace{1_{\mathbb{F}} + \cdots + 1_{\mathbb{F}}}^{n} + \overbrace{(-1_{\mathbb{F}}) + \cdots + (-1_{\mathbb{F}})}^{-m} \\
&= \overbrace{(-1_{\mathbb{F}}) + \cdots + (-1_{\mathbb{F}})}^{-m-n} \\
&=  -( \overbrace{1_{\mathbb{F}} + \cdots + 1_{\mathbb{F}}}^{-m-n} ) \\
&= -(-m-n)_{\mathbb{F}}
\\
&= -(-(n+m))_{\mathbb{F}} = \tau(n+m)
\end{align*}
$$

where the last equality uses $n+m < 0$ and the definition of $\tau$.
