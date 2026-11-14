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
