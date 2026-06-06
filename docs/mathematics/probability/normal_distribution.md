<!-- snippets: latex_math -->
# Normal Distribution

## Complete the matrix square

The matrix version of
$$
\left( x+b \right)^2 - b^2 = x^2 + 2bx
$$
is

/// lemma | Complete The Matrix Square
    attrs: {id: lem-matrix-complete-square}

Let $\mathbf{A}$ and $\mathbf{x}$ be a vector.

Then given $H = \frac{\mathbf{A+A^\top}}{2}$ we have that

$$
\mathbf{x^\top A x = x^\top H x}
$$

If $\mathbf{c} \in \text{range}\mathbf{(H)}$, i.e there exists $\mathbb{d}$ s.t. $\mathbf{Hd=c}$

Then it holds that

$$
\begin{align*}
\mathbf{
\left( x+d \right)^\top H
\left( x+d \right)^\top -
d^\top Hd
}
&=
\mathbf{
x^\top H x + 2 c^\top x
}
\\&=
\mathbf{
x^\top A x + 2c^\top x
}
\end{align*}
$$

///

/// proof | Proof of Complete The Matrix Square

$$
\begin{align*}
\mathbf{
\left( x + d \right)^\top H \left( x + d \right)
} &=
\mathbf{
x^\top H x +
x^\top H d +
d^\top H x +
d^\top H d
}
\\ &=
\mathbf{
x^\top H x +
x^\top H d +
x^\top H^\top d +
d^\top H d
}
\\
\left[ \text{since } \mathbf{H^\top = H} \right]
&=
\mathbf{
x^\top H x +
2 x^\top H d +
d^\top H d
}
\end{align*}
$$
///
