<!-- snippets: latex_math -->
# 2D

## Exercise 1

> (a) Show that the set of numbers in $\left( 0,1 \right)$ that have decimal expansions containing 100 consecutive 4s is a Boreal subset of $\mathbb{R}$
>
> (b) What is the Lebesgue measure of this set in (a)?

A number having 100 4s is equivalent to being inside interval

$$
B(a) = \left( 0 . a_1 \dots a_n 4 \dots 4, 0 . a_1 \dots a_n 4 \dots 5 \right]
\\
\text{for some }
a = 0.a_1 \dots a_n 4 \dots 4, \ a_1,\dots, a_n \in \left\{ 0,1,\dots 9\right\}
$$

Each one of these intervals is Boreal. The countable union of all such unions is therefore Boreal. This countable union exactly is the set of numbers with 100 consecutive 4s.

Note that $\lvert B(a) \rvert = 10^{-(n+100)}$

Note that these intervals are either completely disjoint or one is a subset of another. Therefore, we can count these intervals whilst discarding future smaller intervals that intersect with previous intervals.

Let $C_0 = \left\{ B(0) \right\}$

$$
C_n =
\left\{ B(a) \middle| \\
\begin{array}{l}
\bullet\ B(a) \cap B' = \emptyset \ \forall B' \in \cup_{n<k} C_k, \\
\bullet\ a = 0.a_1 \dots a_n 4 \dots 4
\end{array}
\right\}
$$

Let's consider fixed $m \in \mathbb{N}$ and some $n>m$.

Consider $a = a_1 \dots a_m 4 \dots 4$ and $x=x_1 \dots x_n 4 \dots 4$
There are two ways the smaller $C_m = B(a)$ intervals fall inside a $C_n = B(x)$ interval.

### $n < m + 101$

$x_n$ takes one of these green positions

$$
\begin{array}{c|c|c|c|c|c|c|c}
1 & \dots & m & m + 1 & \dots & m + 100 & m+101 & \dots \\
\hline
\hline
a_1 & \dots & a_m & 4 & \dots & 4 \\
\hline
x_1 & \dots & x_m & \colorbox{green}{} & \colorbox{green}{} & \colorbox{green}{}
\end{array}
$$

So $x_1, \dots x_n$ are forced to be $a_1, \dots 4$ exactly. So 1 possible way for $C_n$ to fall inside $C_m$

### $n \geq m + 101$

$x_n$ takes any position after $m+100$

$$
\begin{array}{c|c|c|c|c|c|c|c}
1 & \dots & m & m + 1 & \dots & m + 100 & m+101 & \dots \\
\hline
\hline
a_1 & \dots & a_m & 4 & \dots & 4 \\
\hline
x_1 & \dots & x_m & & & & \colorbox{green}{} & \colorbox{green}{}
\end{array}
$$

Here we can set $x_{m+101}, \dots x_n$ freely. Hence there are $10^{n-m-100}$ choices.

So when we count $C_n$ we have to remove the double count for $m<n$ where the first 100

$$
\left\{ m | m \geq n-100 \right\}
$$

are removed once and the

$$
\left\{ m | m < n -100 \right\}
$$

are counted $10^{n-m-100}$ times.

Hence,

$$
\begin{align*}
c_n &= 10^n - \sum_{m=n-1}^{n-100} c_m - \sum_{m=n-101}^{0} 10^{n-m-100} c_m
\\ &=
10^n - \sum_{m=0}^{n-1} \lambda_{n,m} c_m
\end{align*}
$$

for

$$
\lambda_{n,m} = \begin{cases}
1 & \text{if } n > m \geq n-100 \\
10^{n-m-100} &\text{if } m < n-100
\end{cases}
$$

Now we are interested in measure of the disjoint union of $C_n$. Notice that $\lvert B \rvert = 10^{-(n+100)}$ for any $B \in C_n$

So we are interested in $c_n / {10^{n+100}}$

$$
\begin{align*}
b_n &= \frac{c_n}{10^n}
&=
1 - \sum_{m=0}^{n-1} \lambda_{n,m} \frac{10^m}{10^n} \frac{c_m}{10^m}
\\ &=
1 - \sum_{m=0}^{n-1} r(n-m) c_m
\end{align*}
$$

where

$$
r(n-m) = \lambda_{n,m} 10^{m-n} = \begin{cases}
10^{m-n} & \text{if } n > m \geq n-100 & \iff n-m \leq 100  \\
10^{-100} &\text{if } m < n-100 & \iff n-m > 100
\end{cases}
$$

Note that $m=0, \dots n-1$ is equivalent to $n-m = n, n-1, \dots 1$

Therefore let $i=n-m$ and increment $i=n, n-1, \dots 1$

$$
\begin{align*}
b_n = 1 - \sum_{i=1}^{n} r_i b_{n-i}
\end{align*}
$$

Let's now take each $b_n$ multiplied by $z^n$ and sum them.

$$
\begin{align*}
B(z) =
\sum_{n=1}^{\infty}b_n z^n &= \sum_{n=1}^{\infty} z^n - \sum_{n=1}^{\infty} \left( \sum_{i=1}^{n} r_i b_{n-i} \right) z^n
\\ &=
\sum_{n=1}^{\infty} z^n - B(z) R(z)
\\&=
\frac{z}{1-z} - B(z) R(z)
\end{align*}
$$

for

$$
B(z) = \sum_{n=1}^{\infty} b_n z^n \\
R(z) = \sum_{i=1}^{\infty} r_i z^i = \sum_{i=1}^{99} 10^{-i} z^i + 10^{-100} \frac{z^{100}}{1-z}
$$

So

$$
\begin{align*}
B(z) &=
\frac{z}{1-z} \frac{1}{1+R(z)}
\\ &=
\frac{z}{\left( 1-z \right) \left( 1 + \sum_{i=1}^{99} 10^{-i} z^i \right) + 10^{-100} z^{100}}
\\ B(1) &= \frac{1}{10^{100}}
\end{align*}
$$

Hence

$$
\sum_{n=0}^{\infty} \frac{c_n}{10^{n+100}} = 1
$$

Hence the Lebesgue measure is 1.
