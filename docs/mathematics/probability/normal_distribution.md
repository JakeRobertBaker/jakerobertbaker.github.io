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

## Normal Distibution

### Definitions

/// definition | Multivariate Normal
    attrs: {id: def-mv-normal}

$\mathbf{x} \in \mathbb{R}^n$ is Multivariate Normal

$\iff \mathbf{x} \sim \mathcal{N} \mathbf{ \left( \mu, \Sigma \right) }$

$\iff$
There exists $\mathbf{\mu} \in \mathbb{R}^n, \mathbf{A} \in \mathbb{R}^{n \times l}$
such that $\mathbf{x = Az + \mu}$ where $\mathbf{A^\top A = \Sigma}$.

Where $\mathbf{z}$ is a [standard normal vector](../linear_models/linear_models.md#def-standard_normal){data-preview}.
///

### SPD

Note: $\mathbf{A^\top A = \Sigma}$ is equivalent to $\mathbf{\Sigma}$ being Semi Positive Definite.

### PDF

/// lemma | Multivariate PDF
    attrs: {id: lem-MV-normal-pdf}

TODO
///
