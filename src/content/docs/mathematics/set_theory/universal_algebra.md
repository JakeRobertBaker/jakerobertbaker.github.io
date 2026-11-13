---
title: Universal Algebra
numbering: true
bracketColors: 0
contentsBlocks: all
---

As I read [*Notes on Logic and Set Theory*](https://www.cambridge.org/core/books/notes-on-logic-and-set-theory/A4D56347336629DBFC20710AF214B245), self study notes live here.

There is some good [discussion](https://math.stackexchange.com/questions/921712/what-is-a-set-raised-to-the-0-power-in-relation-to-the-definition-of-a-nullary)
on singleton sets here.

## Initial Definitions

Before going into Chapter 1. of Johstone I want to skirt over some set theory definitions.

Let's assume that we have the basic ZFC axioms established.

Let's construct a tuple via Kuratowski's definition.

:::definition[Ordered Pair]{#def-ordered-pair}
$(a,b) \coloneqq \left\{ \left\{ a \right\}, \left\{ a, b \right\} \right\}$
:::

Let $A,B$ be sets.

:::definition[function]{#def-function}
A function $f: A\to B$ is

$$
f = \left\{ \left( a, f \left( a \right) \right): a \in A \right\}
$$
:::

Recall the Von Neumann definition of ordinals. I shall revise this properly later.

Basically, $0 = \left\{  \right\} = \emptyset$, $n+1 = n \cup \left\{ n \right\}$, so $n=\left\{ 0,\dots, n-1 \right\}$.

:::definition[$n$-tuple]{#def-n-tuple}
An $n$-tuple is a map from $n$ to $A$
:::

:::example[Traditional Tuple]{#exm-trad-tuple}
The tuple traditionally written as $\left( a,b,c \right)$ is

$\left\{ (0,a), (1,b), (2,c) \right\}$.
:::

:::definition[$A^B$]{#def-set-power}
$$
A^B \coloneqq \left\{ f : \text{f is a map from } B \text{ to } A \right\}
$$
:::

Hence $A^n$ is the set of maps from $n=\left\{ 0, \dots, n-1 \right\}$ to $A$, the set of traditional $n$ length tuples.

:::example[Nullary Set]{#exm-nullary-set}
$A^0$ is the set of maps from $0 = \emptyset = \left\{  \right\}$ to $A$

The only map that does this is
$$
f = \left\{ (x, f(x)) : x \in \emptyset \right\} = \left\{  \right\}
$$

Hence $A^0$ = $\left\{ \emptyset \right\}$.

:::

## Chapter 1. Notes

### Syntax

:::definition[Finary Operation]{#def-Finary-Operation}

A finary operation is a map from $G$ to $G^n, n \in \left\{ 0, 1, 2, \dots \right\}$
:::

:::example[Group Operations]{#exm-group-ops}
A group has associativity, identity and inverses.

$$
\begin{align*}
m &: G \times G & \to G & \text{ multiplication} \\
i &: G & \to G & \text{ inverse} \\
e &: G^0 = \left\{ \emptyset \right\} & \to G & \text{ identity}
\end{align*}
$$

Because $e(\emptyset) \in G$ picks a single element we usually denote it as $e$.

The standard group properties of associative, identity and inverse hold:

$$
\begin{align*}
m(x, m(y,z)) &= m(m(x,y),z) \\
m(e, x) &= x \\
m(i(x),x) &= e
\end{align*}
$$

For all $x,y,z \in G$.
:::

:::definition[Operational Type]{#def-OperationalType}

An operational type is a pair $(\Omega, \alpha)$ with

- set of operation symbols $\Omega$
- a map

$\alpha : \Omega \mapsto \mathbb{N}$ that assigns each $\omega \in \Omega$ it's arity $\alpha(\omega)$.
:::

:::example[Group Arity]{#exm-group-ops-arity}
The operation symbols for a group make an operational type with $\Omega = \left\{ m,i,e \right\}$ and $\alpha(m)=2, \alpha(i)=1, \alpha(e)=0$
:::

A helpful remark on how to think about things. Not from Johnstone.

### Structure

:::remark[Syntax, Semantics and Structure]{#rem-Structure}

- Syntax is just strings of symbols with rules to follow.

- Semantics is actual sets and actual functions where things can be true or false.

Structure is what connects syntax to semantics.

A structure is a set $A$ with a choice of what the symbols $\Omega$ mean on that set.
:::

:::definition[Operational Structure]{#def-op-structure}

An operational structure $(\Omega, \alpha)$ is

- a set $A$ with an operational type $(\Omega, \alpha)$

- a function $\omega_A : A^{\alpha(\omega)} \mapsto A$ for each $\omega \in \Omega$

$\omega_A$ is *the interpretation of abstract symbol* $\omega$ *in the structure $A$*.

:::

:::definition[Homomorphism]{#def-homomorphism}

A map $f:A\mapsto B$ is a homomorphism of $\Omega$ structures $A$ & $B$ if

$$
f(\omega_A (a_1,..., a_n)) = \omega_B (f(a_1),...,f(a_n))
$$

where $\alpha(\omega)=n$ and $\forall a_1,...,a_n \in A$
:::

### Terms

:::definition[$\Omega$-terms properties]{#def-term-properties}
Let $\Omega$ be an operational type and $X$ be a set.

Let $A$ be a set. $A$ satisfies the $\Omega$ term properties if,

a. If $x \in X$ then $x \in A$

b. If $w \in \Omega$ with $\alpha(w)=n$ and $t_1,...,t_n \in A$ then $wt_1...t_n \in A$.
:::

The set $F_{\Omega}(X)$  of $\Omega$ terms is defined as the minimal set that obeys these inductive properties.

:::definition[$\Omega$-terms in $X$]{#def-term}
Let $M$ be the set of finite strings in $\Omega \cup X$.

Consider $\mathcal{C} = \left\{ A \subseteq M : A \text{ satisfies a. and b.} \right\}$

$F_{\Omega}(X) \coloneqq \bigcap_{A \in \mathcal{C}} A$
:::

We often denote $FX \coloneqq F_{\Omega}\left( X \right)$.

Note:

- $\mathcal{C}$ is non empty because $M \in \mathcal{C}$
- $\forall \ A \in \mathcal{C}, X \subseteq A \implies X \subseteq \bigcap_{A \in \mathcal{C}} A$

:::theorem[$F_\Omega(X)$ is a sigma structure]{#thm-FX_is_sigma n=1.1 book=JS}

i. The set of $\Omega$-terms in $X$, $F_{\Omega}(X)$ has a $\Omega$ structure.

ii. Given any $\Omega$ structure $A$ and any map $f:X \mapsto A$ there exists a unique homomorphism $\hat{f}:F_\Omega(X) \mapsto A$

In other words $F_\Omega(X)$ is the free structure generated by $X$
:::

:::proof[Proof of Theorem: $F_\Omega(X)$ is a sigma structure]

Define the interpretation of $\omega$ on FX via
$$
\omega_{FX}(t_1,...,t_n) = \omega t_1 ... t_n
$$

We need to show that this interpretation does indeed map from $F_{\Omega}(X)^{\alpha(\omega)}$ to $F_{\Omega}(X)$

If $\alpha(\omega)=n$ and $t_i$, $i \in \left\{ 1, \dots, n \right\}$ then by b. $w_{FX}(t_1, \dots, t_n)$ is indeed in $FX$.
:::

:::lemma[X terms from finite]{#lem-XfromFinite n=1.3 book=JS}

$F_{\Omega}(X)=\bigcup \lbrace F_{\Omega}(X^\prime) \mid X^\prime \subset X \text{ is finite} \rbrace$
:::

### Derived Operations

:::definition[Derived Operations]{#def-derived_operation}

Let $X_n= \lbrace x_1,...,x_n \rbrace$, $t \in F_{\Omega}(X_n)$, $A$ be a $\Omega$ structure.

The n-ary derived operation 

$t_A : A^n \rightarrow A$ is defined $\forall \underline{a} \in A^n$ by,

If $t=x_{i} \in X_n$

$$
t_A(\underline{a}) = a_i
$$

If $t = \omega t_1 ... t_m$, 

for $t_1,...,t_m \in F_{\Omega}(X_n), \alpha(\omega)=m$

$$
t_A (\underline{a}) = \omega_A \lparen t_1(\underline{a}) ,..., t_m(\underline{a}) \rparen
$$

:::

Note this really does just mean we keep applying the standard operations until we get to the X terms.

Therefore a derived operation really is just the map it represents

:::example[Simple Derived Operation]{#exm-simple_derived_operation}

If $t=mx_1 m x_2 x_3$ then $t_A(\underline{a})= m \left( a_1, m \left( a_2, a_3) \right) \right)$
:::

:::remark[Derived Ops Fill In]{#rem-derived-ops-fill-in}
For general $t \in F_{\Omega}(X_n)$, 
$$
t = \dots \omega x_1 \dots x_m \dots
$$ 

then

$$
t_A(\underline{a}) = \left( \dots, \omega \left( a_1, \dots a_m \right), \dots \right)
$$

It is kind of obvious from the definition. We will prove it rigorously.
:::

In order to prove some of these obvious results rigorously we need structural induction.

:::remark[Structural Induction]{#rem-struc-induct}
We aim to prove property $P(t)$ for every term $t \in F_{\Omega} (X) \subseteq M$.

Let $S = \left\{ t \in F_{\Omega}(X) : P(t) \right\}$.

$S$ satisfies properties (a) and (b) of $\Omega$-terms in $X$ $\implies S \in \mathcal{C}$ $\implies F_{\Omega}(X) \subseteq S$.

Hence $S = F_{\Omega} (X)$.

In practice one has to,

a. Show $P(x)$ holds $\forall \ x \in X$.

b. Show that if $P(t)$ holds for $ t \in \left\{ t_1, \dots, t_m \right\}$ then it holds for $t=\omega t_1 \dots t_m$
:::

### Derived Operation Results

:::proposition[Derived Operations Substitute]{#prp-derived-op-sub}
If, $t \in F_{\Omega} (X_n)$

Then $\forall \ u_1, \dots, u_n \in F_{\Omega} (X_n)$,
$$
t_{FX} \left( u_1, \dots, u_n \right) = t[u_1, \dots, u_n / x_1, \dots, x_n]
$$
:::

:::proof{proves="#prp-derived-op-sub"}

**(a)**
$$
{x_i}(u_1, \dots, u_n) = u_i = x_i[u_i / x_i]
$$

**(b)**

Assume,

- $t=\omega t_1 \dots t_m$,
- ${t_i}_{FX} \left( u_1, \dots, u_n \right) = t_i[u_1, \dots, u_n / x_1, \dots, x_m]$ for each $i=1, \dots, m$.

Then,

$$
\begin{align*}
& t_{FX} \left( u_1, \dots, u_n \right) \\
\text{[derived op def]} &= 
\omega_{FX} \left(
{t_1}_{FX} \left( u_1, \dots, u_n \right), \dots,
{t_m}_{FX} \left( u_1, \dots, u_n \right)
\right) \\
\text{[interpret in FX]} &=
\omega
{t_1}_{FX} \left( u_1, \dots, u_n \right) \dots
{t_m}_{FX} \left( u_1, \dots, u_n \right)
\\
\text{[induct hyp]} &= \omega t_1 [swaps] \dots t_m [swaps] \\
&= t[swaps]
\end{align*}
$$
:::

When $x_i = u_i$ we get,

:::corollary[Derived Ops Are Themselves]{#cor-der-ops-self}
$t_{F_{\Omega}(X)} \left( x_1, \dots, x_n \right) = t $
:::

:::lemma[Derived Ops Commute Homomorphisms]{#lem-derived-ops-commute}
If,

- $h : A \to B$ is a homomorphism
- $t \in F_{\Omega}(X)$

Then,

$$
h \left( t_A \left( a_1, \dots, a_n \right) \right) =
t_B \left( h(a_1), \dots, h(a_n) \right)
$$
:::

:::proof{proves="#lem-derived-ops-commute" open}
let $p(t)$ denote the lemma result.

$$
h \left( t_A \left( a_1, \dots, a_n \right) \right) =
t_B \left( h(a_1), \dots, h(a_n) \right)
\  \forall a_1, \dots, a_n \in A
$$

**(a)**

By definition of derived operators,

$$
h \left( {x_i}_A \left( a_1, \dots, a_n \right) \right) =
h \left( a_i \right) =
{x_i}_B \left( h(a_1), \dots, h(a_n) \right)
$$

**(b)**

Assume $t = \omega t_1 \dots t_m$ and $P(t_i)$ holds for $i=1, \dots, m$ 

$$
\begin{align*}
h \left( t_A \left( a_1, \dots, a_n \right) \right) & \\
\text{[derived op def]} &=
h \left( 
\omega_A \left(
{t_1}_A \left( a_1, \dots, a_n \right), \dots,
{t_m}_A \left( a_1, \dots, a_n \right)
\right) 
\right) \\
\text{ [ops comute homo] } &=
\omega_B \left( 
h \left( {t_1}_A \left( a_1, \dots, a_n \right) \right), \dots
h \left( {t_m}_A \left( a_1, \dots, a_n \right) \right)
\right) \\
[ P(t_i) \text{ holds }] &=
\omega_B \left( 
{t_1}_B \left( h(a_1), \dots, h(a_n) \right), \dots,
{t_m}_B \left( h(a_1), \dots, h(a_n) \right)
\right) \\
\text{ [derived op def] } &=
t_B \left( h(a_1), \dots, h(a_n) \right)
\end{align*}
$$

:::

We can now formally prove [remark](#rem-derived-ops-fill-in).

:::exercise[Derived Ops Fill In]{#ex-1-2 n=1.2 book=JS}
Let,

- $t \in F_{\Omega} \left( X_n \right)$
- $a_1, \dots, a_n$ be elements of $\Omega$ structure $A$.
- $f: X_n \to A$ by $f(x_i) = a_i$
- $ \bar{f} : F_{\Omega} \left( X_n \right) \to A$ be the unique homomorphism extending $f$.

Show,

$$
t_A \left( a_1, \dots, a_n \right) = \bar{f}(t)
$$
:::

This really is just our earlier remark that
$$
t_A(\underline{a}) = \left( \dots, \omega \left( a_1, \dots a_n \right), \dots \right)
$$

:::solution{proves="#ex-1-2" open}
$$
\begin{align*}
\bar{f} \left( t \right) & \\
\by{cor-der-ops-self}
&= \bar{f} \left( t_{F_{\Omega}(X)} \left( x_1, \dots, x_n \right) \right)
\\
\by{lem-derived-ops-commute} &=
t_A \left( 
\bar{f}(x_1), \dots, \bar{f}(x_n)
\right) \\
&= t_A \left( a_1, \dots, a_n \right)
\end{align*}
$$
:::

A simpler wording could be,

Given $f: X \to A$ we obtain the natural extending homomorphism $\bar{f}$ such that $\forall \ t \in FX$

$$
t_{A} \left( f(x_1), \dots f(x_n) \right) = \bar{f} (t)
$$

:::lemma[Substitution Lemma]{#lem-sub-general}
Let,

- $A$ be a $\Omega$ structure.
- $s \in F_{\Omega} \left( X_n \right)$
- $f : X_n \to A$
- $\bar{f}: F_{\Omega} \left( X_n \right) \to A$ be the unique homomorphism extending $f$.
- $x_i \in X_n$, $u \in F_{\Omega} \left( X_n \right)$
- $g : X_n \to A$ which agrees with $f$ on all of $X_n$ except that $g(x_i) = \bar{f} (u)$

Then,

$$
\bar{f} \left( s \left[ u / x_i \right] \right) =
\bar{g} \left( s \right)
$$
:::

:::proof{proves="#lem-sub-general" open}
$$
\begin{align*}
\bar{f} \left( s \left[ u / x_i \right] \right) &= \\
\by{prp-derived-op-sub} &=
\bar{f} \left( s_{FX} \left( x_1, \dots, u, \dots, x_n \right) \right)
\\
\by{lem-derived-ops-commute} &=
s_A \left( \bar{f}(x_1), \dots, \bar{f}(u), \dots, \bar{f}(x_n) \right)
\\
[ \text{def of }g ] &= s_{A} \left( g(x_1), \dots, g(x_i), \dots, g(x_n) \right)
\\
\by{ex-1-2} &=
\bar{g}(s)
\end{align*}
$$
:::

#### Summary

Considering these two results together we can see,

$$
\begin{align*}
{s[u/x_i]}_{FX}(a_1, \dots, a_n) &= \bar{f}(s[u / x_i])
\\
&= \bar{g}(s)
\\
&= s_{FX} (g(x_1), \dots, g(x_i), \dots , g(x_n))
\\
&= s_{FX} (a_1, \dots, u_{FX}(a_1, \dots, a_n), \dots , a_n)
\end{align*}
$$

because $g(x_j) = f(x_j) = a_j \ \forall j \neq i$ and $g(x_i) = \bar{f}(u) = u(a_1, \dots, a_n)$

### Equations

:::definition[n-ary Equation]{#def-nary-eq}

An n-ary equation in operational type $(\Omega, \alpha)$ is an expression $(s=t)$ for $s,t \in F_{\Omega}(X_n)$
:::

:::definition[Satisfied]{#def-nary-satisfied}

An n-ary equation is satisfied in operational structure A iff $t_A \equiv s_A$
:::

:::definition[Algebraic Theory]{#def-theory}

An Algebraic Theory $T=(\Omega, E)$ is an operational type $(\Omega, \alpha)$ and set $E$ of equations in $\Omega$
:::

:::definition[Model]{#def-model}

A model for an Algebraic Theory $T=(\Omega, E)$ or T-algebra is an Operational Structure $\Omega$ where all equations in $E$ are satisfied.
:::

:::example[Group Theory Model]{#exm-group-model}

A group $G$ is a $\left( \Omega, E \right)$ model where $\Omega = \{ m,i,e\}$ and

$$
E=\{(m x_1 m x_2 x_3 = m m x_1 x_2 x_3), (mex_1=x_1), (m i x_1 x_1 = e)\}
$$
:::

### Derived Equations

We will make a similar inductive definition to $FX$.

Let $W \coloneqq \left\{ (s=t) : s,t \in FX \right\}$ denote the set of all possible equations.

::::definition[Derived Equation Properties]{#def-eq-closure-properties}

Let $E$ be a set of equations. A set $T \in \mathcal{C}$ of equations satisfies the derived equation properties iff,

:::list{style="a. (i)"}

1. $E \subset T$

2. $T$ defines an equivalence relation $s \sim_E t \iff (s=t) \in \tilde{E}$ on the set of terms $F_{\Omega}(X)$

    1. reflexive: $(t=t) \in T \ \forall t \in F_{\Omega}(X)$

    2. symmetric: $(s=t) \implies (t=s)$

    3. transitive: $(s=t),(t=u) \implies (s=u)$

3. Substitution rules:

    1. $(s=t) \in T \implies (s[u / x_i] = t[u / x_i]) \in \tilde{E}$

    2. $(s=t) \in T, u \in F_{\Omega}(X_n) \implies \left( u[s/x_i] = u[t/x_i] \right) \in \tilde{E}$

:::

::::

:::definition[Derived Equations]{#def-derived-equation}
Let $\mathcal{D} \coloneqq \left\{ T \subseteq W : \text{derived equation properties hold} \right\}$

The set of derived equations $\tilde{E} \coloneqq \bigcap_{T \in \mathcal{D}} T$

:::


Note this definition really means the intersection of all sets with the above properties. This design is the same pattern we used in defining $FX$.

Let's prove a more general version of c. (i).

:::proposition[Simultaneous Substitution]{#prp-simultaneous-substitution}
If $\left( s=t \right) \in \tilde{E}$ and $u_1, \dots u_n \in FX$ then $\left( s[\underline{u}/\underline{x}] = t[\underline{u}/\underline{x}] \right) \in \tilde{E}$.
:::

:::proof{proves="#prp-simultaneous-substitution"}

Let's choose $y_1, \dots, y_n$ that share no $x_i$ with $s,t,$

Apply c. (i) successively replacing $y_1/x_1, \dots, y_n/x_n$.

We obtain $\left( s \left[ \underline{y} / \underline{x} \right] = t\left[ \underline{y} / \underline{x} \right] \right) \in \tilde{E}$.

Now successively apply c. (i) replacing $u_1 / y_1, \dots, u_n / y_n$ to  obtain

$(s[\underline{u} / \underline{x}] = t[\underline{u} / x]) \in \tilde{E}$
:::


This is just the smallest subset of all possible equations $(s=t)$ such that it is closed under a,b,c.

:::example[Group Theory Example]{#exm-group_theory}

Substitution  rule (c) (i)

Let $t=mex_1$, $s=x_1$, we have $(s=t) = (m e x_1 = x_1) \in \tilde{E}$.

The rule gives us $(m e u = u) \in \tilde{E}, \ \forall u \in FX$

Substitution rule (c) (ii)

Let $u = m x_1 x_2$, $t,s$ as before. We can then take $u$ and replace $x_2$ with $s$ and $t$.

$\left( m x_1 \textcolor{pink}{mex_1} = m x_1 \textcolor{pink}{x_1} \right) \in \tilde{E}$
:::

:::definition[Equivalence Classes of Terms on X]{#def-XEquivalence}

The equivalence classes of $\sim_E$ on $F_{\Omega}(X)$ is $F_{(\Omega, E)}(X)$

Let,

- $[t]$ denote the equivalence class of $t \in F_{\Omega}(X)$.
- $EX$ denote $F_{\Omega, E} \left( X \right)$
:::

:::definition[EX Operation]{#def-ex-operation}
Let $\omega \in \Omega$. Then, $\forall t_1, \dots, t_n \in FX$

$$
\omega_{EX} \left( [t_1], \dots, [t_n] \right) \coloneqq \left[ \omega t_1 \dots t_n \right]
$$
:::

:::proposition[EX operations well defined]{#prp-ex-operations-well-defined}
The interpretation of operation $\omega \in \Omega$ in $F_{(\Omega, E)}(X)$ is well defined.

Let $t_i, s_i \in FX$ and $t_i \sim_{E} s_i \ \forall \ i \in \left\{ 1, \dots, n \right\}$.

Then, $\omega t_1, \dots, t_n  \sim_{E} \omega s_1, \dots, s_n $.
:::

:::proof{proves="#prp-ex-operations-well-defined"}

$\exists N : t_i, s_i \in F_{\Omega} (X_N)$. Let $y=x_{N+1}$. We do this so substitution leaves the $s_i, t_i$ unaffected.

For $j=1, \dots, n$ let,

$$
u_j = \omega t_1 \dots t_{j-1} y s_{j+1} \dots s_n
$$

Let,

$$
\begin{align*}
u_{0} &= \omega s_1 \dots s_n
\\
u_{n+1} &= \omega t_1 \dots t_n
\end{align*}
$$

Substitution rule (c) (ii) gives, for $j=2, \dots n$

$$
\begin{align*}
u_{j} [t_j / y] &\sim u_{j} [s_j / y] \\
\omega t_1 \dots t_j s_{j+1} \dots s_n &\sim \omega t_1 \dots t_{j-1} s_j \dots s_n = u_{j-1} [t_{j-1} / y]
\end{align*}
$$

So, $u_{j} \left[ t_j / y \right] \sim u_{j-1} \left[ t_{j-1} / y \right]$ for $j=2, \dots, n$.

Then,

$$
u_{n+1} = u_{n} [t_n / y] \sim u_{n-1} [t_{n-1} / y] \sim \dots \sim u_1 [t_1 / y] = u_0
$$

Transitivity (b)(iii) gives us that $u_{n+1} \sim u_{0}$ which is what we seek to prove.
:::

:::lemma[Quotient Homomorphism]{#lem-quotient-homomorphism}
Let $q: F_{\Omega}(X) \to F_{\Omega, E}(X)$ by,

$$
q(t) = [t] \ \forall t \in F_{\Omega}(X)
$$

Then, $q$ is a homomorphism.
:::

This is immediate from the definition being well defined. Formally,

:::proof{proves="#lem-quotient-homomorphism"}
Let $\omega \in \Omega, \alpha(\omega)=n, t_1, \dots, t_n \in FX$ 

$$
\begin{align*}
q \left( \omega t_1 \dots t_n \right) \\ 
\text{[def of q]} &= \left[ \omega t_1 \dots t_n \right] \\
\by{prp-ex-operations-well-defined} &= \omega_{EX} \left( [t_1], \dots, [t_n] \right) \\
\text{[def of q]} &= \omega_{EX} \left( q(t_1), \dots, q(t_n) \right)
\end{align*}
$$
:::

In other words we have shown that $\omega_{EX} \left( [u_1], \dots, [u_m] \right) = \left[ \omega_{FX} \left( u_1, \dots, u_m \right) \right]$.

Notice that $\by{lem-quotient-homomorphism}$ and $\by{prp-ex-operations-well-defined}$ really are just the same thing with different wording. These are what Johnstone means by interpretations in $FX$ of operations respect $\sim_{E}$ and hence induce operators on the quotient set $F_{\Omega, E} \left( X \right)$.

Because  derived ops commute $\by{lem-derived-ops-commute}$, the quotient homomorphism $\by{lem-quotient-homomorphism}$ gives us a corollary.

:::corollary[Derived Op Quotient]{#cor-derived-op-quotient}
If $t \in FX$ then,

$$
\begin{align*}
t_{EX} \left( 
q \left( u_1 \right), \dots
q \left( u_n \right)
\right)
&=
q \left( 
t_{FX} \left( u_1, \dots, u_n \right)
\right)
\\
\iff
\\
t_{EX} \left( [u_1], \dots, [u_n] \right) &=
\left[ t_{FX} \left( u_1, \dots, u_n \right) \right]
\end{align*}
$$
:::

::::theorem[The set of equivalence classes satisfies the equations in E]{#thm-E-classes-model n=1.4 book=JS}

:::list{style="(i)"}
1. $F_{(\Omega, E)}(X)$ inherits $\Omega$-structure from $F_{\Omega}(X)$ and satisfies the equations in $E$.

1. $F_{(\Omega, E)}(X)$ is the free model generated by X.

    Given, $(\Omega, E) \text{ model } A$.

    For any map $f: X \to A$ there is a unique homomorphism,

    $\tilde{f}: F_{(\Omega, E)}(X) \to A$

    extending $f$.

:::

::::

:::proof{proves="#thm-E-classes-model"}
**(i)**

$EX$ inherits a valid $\Omega$ structure on the induced operations $\omega_{EX}$ by $\by{prp-ex-operations-well-defined}$.

We can show that equations in $E$ are satisfied in $EX$.

Assume $s,t \in FX$ such that $t \sim_{E} s$. We need to show that $t_{EX} \equiv s_{EX}$.

Note that
$\left( s[\underline{u}/\underline{x}] = t[\underline{u}/\underline{x}] \right) \in \tilde{E}$
by $\by{prp-simultaneous-substitution}$.

Let $u_1, \dots, u_n \in FX$. Then, 

$$
\begin{align*}
s_{EX} \left( 
[u_1], \dots, [u_n] 
\right) \\
\by{cor-derived-op-quotient} &=
\left[ s_{FX} \left( u_1, \dots, u_n \right) \right] \\
\by{prp-derived-op-sub} &= [s[\underline{u} / \underline{x}]] \\
\text{[above Note.]} &= [t[\underline{u} / \underline{x}]]
\\
\by{prp-derived-op-sub} &=
\left[ t_{FX} \left( u_1, \dots, u_n \right) \right] \\
\by{cor-derived-op-quotient} &= t_{EX} \left( [u_1], \dots, [u_n] \right)
\end{align*}
$$

**(ii)**

Let 

$$
\hat{E} = \left\{ \left( s=t \right) : h(s)=h(t) \ \forall \ \Omega \text{ homomorphism } h \right\}
$$

We will show that $\hat{E}$ satisfies closure properties (a,b,c) of [Derived Equations](#def-derived-equation) and therefore $\tilde{E} \subseteq \hat{E}$.

a.

If $(t=s) \in E$ then the quotient homomorphism gives us $[s] = q(s) = q(t) = [t]$

b. RST is easy.

c. (i)

If $(t=s) \in \hat{E}$, $h$ is any homomorphism, $u \in FX$ then the [substitution lemma](#lem-sub-general) gives us that $h(s[u / x_i]) = h'(s)$ where $h'$ is the unique homomorphism defined by agreeing with $h$ on $x_j: j \neq i$ and $h'(x_i) \coloneqq h(u)$.

Hence,

$$
\begin{align*}
h(s[u / x_i]) &= h'(s) = h'(t) = h(t[u / x_i])
\end{align*}
$$

c. (ii)

Again assume $(t=s) \in \hat{E}$, $h$ some $FX \to A$ homomorphism.

The same substitution lemma gives us a new $h'$ homomorphism that agrees with $h$ on $x_j:j \neq i$ and $h'(x_i) \coloneqq h(s)$ where

$$
h \left( u [s / x_i] \right) = h' (u)
$$

This lemma also gives us $h''$ homomorphism that agrees with $h$ on $x_j : j \neq i$ and $h''(x_i) = h(t)$ where

$$
h \left( u [t / x_i] \right) = h'' (u)
$$

Both $h'$ and $h''$ agree on $x_j : j\neq i$ and agree on $x_i$ because $(s=t) \in \hat{E}$. Therefore $h'$ and $h''$ are identical and therefore

$$
h \left( u [t / x_i] \right) = h \left( u [s / x_i] \right)
$$

Because we have proven the closure properties for $\hat{E}$ we have that $\tilde{E} \subseteq \hat{E}$.

Therefore all equations $(t=s) \in \tilde{E}$ have the property that $h(s)=h(t)$ for any homomorphism $h$.

This means that any homomorphism $h$ factors through the quotient map:

we obtain unique $k : EX \to A$ by $k([t]) \coloneqq h(t)$ which works for any equivalence class representative we choose because $\tilde{E} \subseteq \hat{E}$.

$$
\begin{array}{ccc}
F_\Omega(X) & \xrightarrow{\quad q\quad} & F_{(\Omega,E)}(X) \\[0.3em]
& {\scriptstyle h}\,\searrow \qquad \swarrow\,{\scriptstyle k} & \\[-0.3em]
& A &
\end{array}
$$

i.e $h = k \circ q$

In particular when $f : X \to A$ we have a unique homomorphism $\bar{f} : FX \to A$ which makes a unique map (denoted as $k$ above) $\tilde{f}: EX \to A$ extending $f$.

:::

This gives way to ...

:::corollary[Derived Equations $\iff$ true in all models]{#cor-der-eq-true-all-models}
Let $\left( \Omega, E \right)$ be an Algebraic Theory. Then,

$$
\left( s=t \right) \in \tilde{E} \iff \left( s=t \right) \text{ satisfied in every } \left( \Omega, E \right) \text{ model}
$$
:::

:::proof{proves="#cor-der-eq-true-all-models"}

$\implies$

The equations satisfied in a particular $\left( \Omega, E \right)$ model obey the [closure properties](#def-eq-closure-properties) of derived equations.

Properties (a) and (b) are easy. I will show c.

Assume $(s=t)$ is satisfied in model $A$. So $s_A \equiv t_A$. Let $a_1, \dots, a_n \in A$.

c. (i)


Our derived operation [results](#summary) give us that

$$
\begin{align*}
{s[u/x_i]}_A \left( a_1, \dots, a_n \right)
&= s_A(a_1, \dots, u_A(a_1, \dots, a_n), \dots, a_n) \\
&= t_A(a_1, \dots, u_A(a_1, \dots, a_n), \dots, a_n)
&= {t[u/x_i]}_A \left( a_1, \dots, a_n \right)
\end{align*}
$$

c. (ii)

$$
\begin{align*}
{u[s/x_i] }_{A} \left( a_1, \dots, a_n \right)
&= u_A \left( a_1, \dots, s_A \left( a_1, \dots, a_n \right), \dots, a_n \right) \\
&= u_A \left( a_1, \dots, t_A \left( a_1, \dots, a_n \right), \dots, a_n \right)
&= {u[t/x_i]}_{A} \left( a_1, \dots, a_n \right)
\end{align*}
$$

Therefore, the equations satisfied in every $\left( \Omega, E \right)$ model obey those closure properties.

Therefore $\tilde{E} \subseteq \left\{ (s=t) : \text{satisfied in every} \left( \Omega, E \right) \text{ model} \right\}$.


$\impliedby$

Assume $(s=t)$ is satisfied in every $\left( \Omega, E \right)$ model.

It is therefore satisfied in the model $EX$. In particular

$s_{EX} \left( [x_1], \dots, [x_n] \right) = t_{EX} \left( [x_1], \dots, [x_n] \right)$

Now,

$$
\begin{align*}
s_{EX} \left( [x_1], \dots, [x_n] \right) \\
\by{cor-derived-op-quotient}
&= [s_{FX}(x_1, \dots, x_n)] \\
&= [s]
\end{align*}
$$

The same holds for $t$ and therefore $[s] = [t]$.
:::

The above corollary is a bit like a completeness theorem.

$\left( s=t \right) \in \tilde{E}$ is like saying that an equation is provable.

## Boolean Algebra

An important example.

Let $2 \coloneqq \{0,1\}$ and

$$
\Omega \coloneqq \{\top, \bot, \neg, \land, \lor, \Rightarrow, \Leftrightarrow\}.
$$

The interpretation on $A=2$ is defined as follows:

$$
\begin{align*}
\top_2 &= 1 \\
\bot_2 &= 0 \\
\neg_2(a) &= 1-a \\
\land_2(a,b) &= \min(a,b) \\
\lor_2(a,b) &= \max(a,b) \\
\Rightarrow_2(a,b) &= 0 \iff a=1 \text{ and } b=0 \\
\Leftrightarrow_2(a,b) &= 1 \iff a=b.
\end{align*}
$$

The arities are:

- $\alpha(\omega)=0$ for $\omega \in \{\top,\bot\}$.
- $\alpha(\neg)=1$.
- $\alpha(\omega)=2$ for $\omega \in \{\land,\lor,\Rightarrow,\Leftrightarrow\}$.

:::definition[Boolean Algebra]{#def-boolean-algebra}
A Boolean algebra is an $(\Omega,E)$-algebra where $\Omega$ is as above and $E$ is the set of all equations satisfied in $2$.
:::

Notice that $E$ contains

$$
\begin{align*}
\top &= (\bot \Rightarrow \bot) \\
\neg x &= (x \Rightarrow \bot) \\
(x \lor y) &= (\neg x \Rightarrow y) \\
(x \land y) &= \neg(\neg x \lor \neg y) \\
(x \Leftrightarrow y) &= (x \Rightarrow y) \land (y \Rightarrow x).
\end{align*}
$$

These are easily verified by checking that they are satisfied in $2$. Formally, the notation says that:

$$
\Rightarrow_2(\bot,\bot) = \Rightarrow_2(0,0) = 1
$$

$$
\top_2 = 1.
$$

Similarly, for $\neg x = (x \Rightarrow \bot)$,

$$
\Rightarrow_2(x,\bot) = \Rightarrow_2(x,0).
$$

Then

$$
\begin{align*}
\Rightarrow_2(1,0) &= 0 = \neg_2(1) \\
\Rightarrow_2(0,0) &= 1 = \neg_2(0).
\end{align*}
$$

Similarly for the others:

| $x$ | $y$ | $\neg x \Rightarrow y$ | $\neg x \lor \neg y$ | $\neg(\neg x \lor \neg y)$ | $x \Rightarrow y$ | $y \Rightarrow x$ | $x \Leftrightarrow y$ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| $0$ | $0$ | $0$ | $1$ | $0$ | $1$ | $1$ | $1$ |
| $1$ | $0$ | $1$ | $1$ | $0$ | $0$ | $1$ | $0$ |
| $0$ | $1$ | $1$ | $1$ | $0$ | $1$ | $0$ | $0$ |
| $1$ | $1$ | $1$ | $0$ | $1$ | $1$ | $1$ | $1$ |


Therefore we can have define $\Omega = \left\{ \bot, \implies \right\}$ and let the symbols $\top, \neg, \dots$ denote derived operations defined by the equations above.

$$
\begin{align*}
(s=t) \in E
&\iff s_2 \equiv t_2 \\
&\iff (s \Leftrightarrow t)_2 \equiv 1 \\
&\iff (s \Leftrightarrow t)_2 \equiv \top_2 \\
&\iff ((s \Leftrightarrow t)=\top) \in E.
\end{align*}
$$

We can then focus on equations of the form $(t=\top)$.

:::definition[Tautology]{#def-tautology}
If $(t=\top) \in E$, $t$ is a *tautology*.

Equivalently, $t_2 : 2^n \to 2$ constantly returns $1$.
:::

::::example[Tautologies]{#exm-tautologies}
:::list{style="a."}
1. $x \Rightarrow (y \Rightarrow x)$.
2. $(x \Rightarrow (y \Rightarrow z)) \Rightarrow ((x \Rightarrow y) \Rightarrow (x \Rightarrow z))$.
3. $((x \Rightarrow \bot) \Rightarrow \bot) \Rightarrow x$.
:::
::::

For (b), let $s=x \Rightarrow (y \Rightarrow z)$ and $t=(x \Rightarrow y) \Rightarrow (x \Rightarrow z)$.

| $x$ | $y$ | $z$ | $y \Rightarrow z$ | $x \Rightarrow y$ | $x \Rightarrow z$ | $s$ | $t$ | $s \Rightarrow t$ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $0$ | $0$ | $0$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ |
| $0$ | $0$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ |
| $0$ | $1$ | $0$ | $0$ | $1$ | $1$ | $1$ | $1$ | $1$ |
| $0$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ |
| $1$ | $0$ | $1$ | $1$ | $0$ | $1$ | $1$ | $1$ | $1$ |
| $1$ | $0$ | $0$ | $1$ | $0$ | $0$ | $1$ | $1$ | $1$ |
| $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ | $1$ |
| $1$ | $1$ | $0$ | $0$ | $1$ | $0$ | $0$ | $0$ | $1$ |

In fact, $s \Leftrightarrow t$.

(c) is obvious when you note that it is just $\neg \neg x \implies x$.
