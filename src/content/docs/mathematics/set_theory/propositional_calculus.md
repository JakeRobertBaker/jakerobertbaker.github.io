---
title: "Propositional Calculus"
numbering: true
bracketColors: 0
contentsBlocks: all
---

## Chapter 2. Notes

### Notation

| Universal algebra | Propositional calculus |
| --- | --- |
| Variables $X$ | Primitive propositions $P$ |
| An $\Omega$-term in $X$ | Propositions (handwritten qualifier unclear): $\{\bot, \Rightarrow\}$-terms in $P$ |
| $x \in 2 = \{0,1\}$ | Truth values |

Let

$$
FP \coloneqq F_{\left\{ \bot, \Rightarrow \right\}} \left( P \right)
$$

A valuation is a map

$$
v : P \to 2.
$$

The valuation $v$ has a corresponding homomorphism

$$
\bar{v} : FP \to 2.
$$

### Semantic Entailment

:::definition[Semantic entailment]{#def-semantic-entailment}
Let $S \subseteq FP$ be a set of propositions and $t \in FP$ be a single proposition.

$S$ *semantically entails* $t$ (write $S \models t$) if, for every

$$
v : \{\text{primitive propositions involved in } S \cup \{t\}\} \to 2
$$

that has $\bar{v}(s) = 1$ for all $s \in S$, we have $\bar{v}(t) = 1$.
:::

:::proposition[Substitution preserves semantic entailment]{#prp-substitution-semantic-entailment}
If $S \models t$, then

$$
\{s[u/q] : s \in S\} \models t[u/q]
$$

for all $u \in FP$ and $q \in P$.
:::

:::proof{proves="#prp-substitution-semantic-entailment"}
Take any valuation $v$ such that $\bar{v}(s[u/q]) = 1$ for all $s \in S$. We need to show that $\bar{v}(t[u/q]) = 1$.

The Chapter 1 substitution lemma gives us that

$$
\bar{v}(s[u/q]) = s_2\bigl(v(x_1), \dots, u_2(v(x_1), \dots, v(x_n)), \dots, v(x_n)\bigr),
$$

where $u$ is made from, and $q$ is in, $\{x_1, \dots, x_n\}$.

Define a new valuation $f : FP \to 2$ by

$$
f(x) =
\begin{cases}
u_2(v(x_1), \dots, v(x_n)) & \text{if } x = q, \\
v(x) & \text{otherwise.}
\end{cases}
$$

Since $v : \{\text{primitives in } S \cup \{t\}\} \to 2$, this definition is a valid valuation. Then, since $S \models t$, it holds that $\bar{f}(t) = 1$. Notice that

$$
\begin{align*}
\bar{f}(t) &= t_2(f(x_1), \dots, f(x_n)) \\
&= t_2\bigl(v(x_1), \dots, u_2(v(x_1), \dots, v(x_n)), \dots, v(x_n)\bigr) \\
&= \bar{v}(t[u/q]).
\end{align*}
$$
:::

### Syntax

As noted in the [Chapter 1 remark on syntax, semantics and structure](universal_algebra.md#rem-Structure), syntax is about shuffling symbols without access to truth tables. Semantics is about valuation of truth values.

:::definition[Axiom set]{#def-axiom-set}
The axiom set $\mathrm{Ax} \subset FP$ is defined as

$$
\begin{align*}
\mathrm{Ax} \coloneqq {}& \{(s \Rightarrow (t \Rightarrow s)) : s,t \in FP\} \\
&\cup \{(x \Rightarrow (y \Rightarrow z)) \Rightarrow ((x \Rightarrow y) \Rightarrow (x \Rightarrow z)) : x,y,z \in FP\} \\
&\cup \{(\neg\neg t \Rightarrow t) : t \in FP\},
\end{align*}
$$

where $\neg x \coloneqq (x \Rightarrow \bot)$, as defined as shorthand in Chapter 1.
:::

An easier definition could be:

:::definition[Axiom set via derived operations]{#def-axiom-set-derived-operations}
Let $a \coloneqq p \Rightarrow (q \Rightarrow p) \in FP$ be the term for (a).

Then

$$
a_{FP}(s,t) = a_{FP}[s,t/p,q]
$$

by [simultaneous substitution](universal_algebra.md#prp-simultaneous-substitution) (Chapter 1).

The map

$$
\begin{aligned}
a_{FP} : FP^2 &\to FP \\
(s,t) &\mapsto a_{FP}(s,t)
\end{aligned}
$$

has image $a_{FP}(FP^2)$. Define similar constructions for $b,c$. Then

$$
\mathrm{Ax} \coloneqq a_{FP}(FP^2) \cup b_{FP}(FP^3) \cup c_{FP}(FP).
$$
:::

Note that Johnstone states this less formally as: adopt as axioms all substitution instances of

:::list{style="(a)"}
1. $(p \Rightarrow (q \Rightarrow p))$
2. $((p \Rightarrow (q \Rightarrow r)) \Rightarrow ((p \Rightarrow q) \Rightarrow (p \Rightarrow r)))$
3. $(\neg\neg p \Rightarrow p)$
:::

Johnstone also gives a rule of inference, *modus ponens*: from $p$ and $(p \Rightarrow q)$ we may infer $q$. Allow all substitution instances of this rule. We get this rule via (iii) of the construction below.

::::definition[$S$-closed]{#def-s-closed}
Let $S \subseteq FP$. A set $D \subseteq FP$ is *$S$-closed* if

:::list{style="(i)"}
1. $\mathrm{Ax} \subseteq D$,
2. $S \subseteq D$,
3. if $s \in D$ and $(s \Rightarrow t) \in D$, then $t \in D$.
:::
::::

:::definition[Syntactic entailment]{#def-syntactic-entailment}
Let $S \subseteq FP$ and

$$
\mathcal{D}_S \coloneqq \{D \subseteq FP : D \text{ is } S\text{-closed}\}.
$$

Define

$$
\mathrm{Th}(S) \coloneqq \bigcap_{D \in \mathcal{D}_S} D,
$$

and define $S \vdash t \iff t \in \mathrm{Th}(S)$.
:::

:::remark
- $\mathcal{D}_S \neq \emptyset$ since $FP \in \mathcal{D}_S$.
- It is easy to show that $\mathrm{Th}(S) \in \mathcal{D}_S$, since it satisfies (i)–(iii). For example, for (iii):

$$
\begin{align*}
& \text{If }s, (s \Rightarrow t) \in \mathrm{Th}(S) 
\\
& \text{then }s, (s \Rightarrow t) \in D \ \forall D \in \mathcal{D}_S
\\
& \text{then } t \in D \ \forall D \in \mathcal{D}_S
\\
& \text{then } t \in \mathrm{Th}(S)
\end{align*}
$$

hence $t \in \mathrm{Th}(S)$.
:::

:::definition[Johnstone]{#def-deduction}
A deduction from $S \subseteq FP$ to $t \in FP$ is  
a sequence of propositions in $FP$ such that each member  
is either an axiom, in $S$, or modus ponens obtained.
:::

We can show $S \vdash t$ iff $\exists$ deduction from $S$ to $t$.

:::proposition{#prp-construction-th-s}
Let,

$$
\begin{align*}
D_0 &\coloneqq \mathrm{Ax} \cup S \\
D_{n+1} &\coloneqq D_n \cup \{t \mid \exists s : s, (s \Rightarrow t) \in D_n\}
\qquad \forall n \in \mathbb{N}_0
\end{align*}
$$

Then, $\displaystyle \mathrm{Th}(S) = \bigcup_{n \in \mathbb{N}_0} D_n$.
:::

:::proof{proves="#prp-construction-th-s"}
$\mathrm{Th}(S) \subseteq \bigcup_n D_n$ shown via $\bigcup_n D_n$ is $S$-closed.  
Clearly (i) & (ii) hold via $D_0$ definition.  
If $s, (s \Rightarrow t) \in D$ then $s \in D_n$, $(s \Rightarrow t) \in D_m$ for some $n,m \in \mathbb{N}_0$.  
Let $N \coloneqq \max(n,m)$ then since $D_n \subseteq D_{n+1}$ $s, (s \Rightarrow t) \in D_N$.  
Then $t \in D_{N+1}$ by definition.

$\bigcup_n D_n \subseteq \mathrm{Th}(S)$ shown via $D_n \subseteq D$ $\forall D \in \mathcal{D}_S$.  
Let $D \in \mathcal{D}_S$. $D_0 \subseteq D$ by (ii) & (iii).  
Assume $\forall k \leq n$ that $D_k \subseteq D$.  
Then if $t \in D_{n+1}$ we have $s, (s \Rightarrow t) \in D_n$ by defⁿ of $D_n$.  
Then $s, (s \Rightarrow t) \in D$ which gives $t \in D$.  
Hence $D_{n+1} \subseteq D$.  
Hence by induction $D_n \subseteq D$ $\forall n$ & $\therefore$ $\bigcup_n D_n \subseteq D$.  
Hence $\bigcup_n D_n \subseteq \mathrm{Th}(S)$. $\square$
:::

:::definition{#def-theorem}
A deduction from the empty set $\emptyset \vdash t$ is  
abbreviated $\vdash t$ and refered to as $t$ is a  
theorem (of the propositional calculus).
:::
