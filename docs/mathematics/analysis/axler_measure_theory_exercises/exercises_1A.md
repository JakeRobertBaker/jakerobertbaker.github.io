<!-- snippets: latex_math -->

# EXERCISES 1A

## 7.

### Solution.

By definition of supremum 

$$
L \left( f, \left[ a,b \right] \right) \geq L \left( f, P_n, \left[ a,b \right] \right)
$$

Then by preservation of non strict inequalities

$$
L \left( f, \left[ a,b \right] \right) \geq \lim_{ n \to \infty} L \left( f, P_n, \left[ a,b \right] \right)
$$

Let $P_n$ be denoted by intervals $I_j = \left[ x_{j-1}, x_j \right]$ where $x_j = a + j \frac{b-a}{2^j}$ for $j \in \left\{ 1,\dots, 2^n \right\}$

Let $R$ be an arbitrary partition of $[a,b]$, with endpoints $\left\{ a=r_0, \dots, r_m=b \right\}$ and $R_j = [r_{j-1}, r_j]$.

We can then make $n$ sufficently large such that every $P_n$ interval $I_j$ is either fully within some $R$ interval or lives exactly within two adjacent $R_k, R_{k+1}$,

i.e. $x_{j-1} < r_k < x_j$ for some $k \in \left\{ 1, \dots, m \right\}$ and $j \in \left\{ 1, \dots, 2^n \right\}$

$$
\begin{align*}
& L(f, P_n, [a,b]) - L(f, R, [a,b]) = 
\\
&
\sum_{j : I_j \subseteq R_k  \text{ some } k \in \left\{ 1, \dots,m \right\}}
\left| I_j \right|
\left( 
\inf_{I_j}{f} - \inf_{R_k}{f}
\right)
\\ &+
\sum_{j : x_{j-1} < r_k < x_j \text{ some } k \in \left\{ 1, \dots,m \right\}}
\left| I_j \cap R_k \right|
\left( 
\inf_{I_j}{f} - \inf_{R_k}{f}
\right)
+ \left| I \cap R_{k+1} \right|
\left( 
\inf_{I_j}{f} - \inf_{R_{k+1}}{f}
\right)
\end{align*}
$$


Now, for $j: x_{j-1} < r_k < x_j \text{ some } k \in \left\{ 1, \dots,m \right\}$

$$
\begin{align*}
&
\left|
\left| I_j \cap R_k \right|
\left( 
\inf_{I_j}{f} - \inf_{R_k}{f}
\right)
+ \left| I \cap R_{k+1} \right|
\left( 
\inf_{I_j}{f} - \inf_{R_{k+1}}{f}
\right)
\right|
\\ &=
\left|
\left( r_k - x_{j-1} \right)
\left( 
\inf_{I_j}{f} - \inf_{R_k}{f}
\right)
+ \left( x_j - r_k \right)
\left( 
\inf_{I_j}{f} - \inf_{R_{k+1}}{f}
\right)
\right|
\\ &\leq
(a-b) 2^{-n} 2c + (a-b) 2^{-n} 2c
\end{align*}
$$

Where $c \geq \left| f(x) \right| \forall x  \in [a,b]$ is the $f$ bound.

Now the second sum over $\left\{ j: x_{j-1} < r_k < x_j \text{ some } k \in \left\{ 1, \dots,m \right\} \right\}$ has at most $m$ elments since there are at most $m$ endpoints between two $R$ intervals for each $I_j$ to overlap with.

Therefore

$$
\left|
\sum_{j : x_{j-1} < r_k < x_j \text{ some } k \in \left\{ 1, \dots,m \right\}}
\left| I_j \cap R_k \right|
\left( 
\inf_{I_j}{f} - \inf_{R_k}{f}
\right)
+ \left| I \cap R_{k+1} \right|
\left( 
\inf_{I_j}{f} - \inf_{R_{k+1}}{f}
\right)
\right|
\leq 4 c m (b-a)2^{-n}
$$

Which gives

$$
\begin{align*}
L(f, P_n, [a,b]) - L(f, R, [a,b]) 
& \geq
\sum_{j : I_j \subseteq R_k  \text{ some } k \in \left\{ 1, \dots,m \right\}}
\left| I_j \right|
\left( 
\inf_{I_j}{f} - \inf_{R_k}{f}
\right)
&- 4cm (b-a)^{-n}
\\
&\geq
-4cm (b-a)^{-n}
\end{align*}
$$

Taking limits gives

$$
\lim_{n \to \infty} L(f, P_n, [a,b]) - L(f, R, [a,b]) \geq 0
$$
