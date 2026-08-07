<!-- snippets: latex_math -->
# Uniform Fraction

Let $X,Y \sim$ $U\left( 0,1 \right)$,

$$
A = \left\{ \text{The closest interget to } \frac{X}{Y} \text{is even.} \right\}
$$

What is $\mathbb{P}\left( A \right)$?

Let's condition on $\left\{ Y=y \right\}$.

Let $A_k = \left\{ \frac{X}{Y} \text{ closest to } k \right\}$, $k \in \mathbb{N}_0$.

$\frac{X}{Y}$ closest to $k$ is $\iff$ $X \in \left[(k-\frac{1}{2})y, (k+\frac{1}{2})y  \right] \coloneqq I_k$

Let $q$ be the largest even integer such that the $q$th $y$ interval is in $\left[ 0,1 \right]$.

$$
\left( q-\frac{1}{2} \right)y<1
$$

and

$$
\left( q+2-\frac{1}{2} \right)y > 1
\iff
 \left( q+\frac{3}{2} \right)y > 1
$$

If $q=0$ then $1<y<\frac{2}{3}$. The $y=\frac{2}{3}$ case is when $I_2$ moves into $\left[ 0,1 \right]$.

$$
\begin{array}{cccc}
I_0 &  &I_1
\\
| & )(& &)
\\
0 &\frac{1}{3}=\frac{y}{2} & & 1
\end{array}
$$

In this case $\mathbb{P}\left( A | Y=y\right) = \frac{y}{2}$

If even $q >0$ then
$\frac{1}{\left( q+\frac{3}{2} \right)}<y<\frac{1}{\left( q-\frac{1}{2} \right)}$.

This interval is fully in $\left[ 0,1 \right] \iff \left( q+\frac{1}{2} \right)y<1$.

In this case there is $\frac{y}{2}  + \frac{q}{2}y$ even area in $\left[ 0,1 \right]$.

If the interval is not fully in $\left[ 0,1 \right] \iff \left( q+\frac{1}{2} \right)y>1$.

In this case the even area is

$$
\frac{y}{2} + \left( \frac{q}{2} - 1 \right)y + 1-\left( q-\frac{1}{2} \right)y
\\
= 1 + y\left( 1/2+q/2-1-q+1/2 \right)
\\
= 1 - y \frac{q}{2}
$$

So

$$
\begin{align*}
\frac{1}{ q+\frac{3}{2} }<y<\frac{1}{ q+\frac{1}{2} }
&\iff
\mathbb{P}\left( A | Y=y \right) =
\left( \frac{q+1}{2} \right)y
\\ \\
\frac{1}{ q+\frac{1}{2} }<y<\frac{1}{ q-\frac{1}{2} }
&\iff
\mathbb{P}\left( A | Y=y \right) = 1-y\frac{q}{2}
\end{align*}
$$

Therefore,

$$
\begin{align*}
\mathbb{P} \left( A \right) &=
\int_{2/3}^{1} \frac{y}{2} \, dy +
\sum_{n=1}^{\infty}
\left[
\int_{\frac{1}{2n+1/2}}^{\frac{1}{2n-1/2}}
1-ny
\, dy +
\int_{\frac{1}{2n+3/2}}^{\frac{1}{2n+1/2}} \frac{2n+1}{2}y \, dy
\right]
\\
&=
\frac{5}{36} +
\sum_{n=1}^{\infty}
\left[
y - n \frac{y^2}{2}
\right]_{\frac{1}{2n+1/2}}^{\frac{1}{2n-1/2}} +
\left[
\frac{2n+1}{4}y^2
\right]_{\frac{1}{2n+3/2}}^{\frac{1}{2n+1/2}}
\\ &=
\frac{5}{36} +
\sum_{n=1}^{\infty}
\left[ 
\begin{aligned}
& \frac{1}{2n-1/2} - \frac{1}{2n+1/2}  
-\frac{n}{2}\left( \frac{1}{(2n-1/2)^2} - \frac{1}{(2n+1/2)^2} \right)
\\ & +
\frac{2n+1}{4} \left( \frac{1}{(2n+1/2)^2} - \frac{1}{(2n+3/2)^2} \right)
\end{aligned}
\right]
\\ &=
\frac{5}{36} +
\sum_{n=1}^{\infty}
\left[ 
\begin{aligned}
& \frac{1}{2n-1/2} - \frac{1}{2n+1/2}  
-\frac{n}{2}\left( \frac{4n}{(2n-1/2)^2 (2n+1/2)^2} \right)
\\ & +
\frac{2n+1}{4} \left( \frac{6n + 9/4 - 2n - 1/4}{(2n+1/2)^2 (2n+3/2)^2} \right)
\end{aligned}
\right]
\\ &=
\frac{5}{36} +
\sum_{n=1}^{\infty}
\left[ 
\begin{aligned}
& \frac{1}{2n-1/2} - \frac{1}{2n+1/2}  
- \frac{2n^2}{(2n-1/2)^2 (2n+1/2)^2} 
\\ & +
\frac{(2n+1)^2}{2}  \frac{1}{(2n+1/2)^2 (2n+3/2)^2} 
\end{aligned}
\right]
\\ &=
\frac{5}{36} +
\sum_{n=1}^{\infty}
\left[ 
\begin{aligned}
& \frac{1}{(2n-1/2)^2 (2n+1/2)^2}
- \frac{2n^2}{(2n-1/2)^2 (2n+1/2)^2} 
\\ & +
\frac{(2n+1)^2}{2}  \frac{1}{(2n+1/2)^2 (2n+3/2)^2} 
\end{aligned}
\right]
\\ &=
\frac{5}{36} +
\sum_{n=1}^{\infty}
\left[ 
\begin{aligned}
& \frac{16}{(4n-1)^2 (4n+1)^2}
- \frac{32n^2}{(4n-1)^2 (4n+1)^2} 
\\ & +
(2n+1)^2  \frac{8}{(4n+1)^2 (4n+3)^2} 
\end{aligned}
\right]
\\ &=
\frac{5}{36} +
\sum_{n=1}^{\infty}
\left[ 
\begin{aligned}
& \frac{16}{(4n-1)^2 (4n+1)^2}
- \frac{32n^2}{(4n-1)^2 (4n+1)^2} 
\\ & +
(2n+1)^2  \frac{8}{(4n+1)^2 (4n+3)^2} 
\end{aligned}
\right]
\end{align*}
$$

