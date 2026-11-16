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


Let

$$
FP \coloneqq F_{\left\{ \bot, \Rightarrow \right\}}
$$

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
