---
title: Chapter 3
---

## Exercises
### Exercise 3.9

#### i.

Assume that $A$ satisfies the hypothesis of theorem 3.7,
- $A \subseteq \mathbb{R}$ be non empty.
- $A$ is bounded above, $\exists K \in \mathbb{R} : a \leq K\ \forall a \in A$

$\exists a_0 \in A$ because $A$ is non empty.

Let $b_0 \coloneqq K$. Hence $a \leq b_0 \ \forall a \in A$.

$a_0 \in \left[ a_0, b_0 \right] \cap A \neq \emptyset$.

#### ii.

Then $\forall n \in \mathbb{N}$ consider 

$$
m_{n-1} = \frac{a_{n-1} + b_{n-1}}{2}
$$

Two cases.

##### If $m_{n-1}$ is an upper bound of $A$

Let $[a_n, b_n] = [a_{n-1}, m_{n-1}] $.

$[a_{n-1}, b_{n-1}] \cap A \neq \emptyset$ by induction.

Since $m_{n-1}$ is an upper bound of $A$ this intersection must occur in the first half, $[a_{n-1}, m_{n-1}]$ of $[a_{n-1}, b_{n-1}]$.

Hence $[a_n, b_n] \cap A \neq \emptyset$.

##### If $m_{n-1}$ is **not** an upper bound of $A$

Let $[a_n, b_n] = [m_{n-1}, b_{n-1}] $.

Then $b_{n-1}$ is an upper bound for $A$ by induction.

There exists $a \in A : a > m_{n-1} = a_n$. Hence $[a_n, b_n] \cap A \neq \emptyset$

##### In both cases 
- $a_{n-1} \leq a_{n} \leq b_{n} \leq b_{n-1}$
- $b_n - a_n = \frac{b_{n-1} - a_{n-1}}{2}$

#### iii.

The sequence $b_n$ decreases and is bounded below by any element of $A$. This sequence converges to some $b \in \mathbb{R}$ by the fundamental axiom.

$b_n - a_n = \left( \frac{1}{2} \right)^n \left( b_0 - a_0 \right) \to 0$

Hence $a_n \to b$ as $n \to \infty$.

By preservation of non strict inequality $b$ is an upper bound of $A$.

Suppose $\beta < b$. There exists $N(\epsilon)$, $\epsilon = \frac{\beta + b}{2}$ for example, such that

$$
\beta < a_n \ \forall n \geq N
$$

Because $[a_n, b_n] \cap A \neq \emptyset$ there exists $a \in A$ such that $\beta < a_n \leq a$.

Hence $\beta$ is not an upper bound of $A$.

Therefore $b$ is the least upper bound of $A$.
