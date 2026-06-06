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

Let $\mathbf{x} \sim \mathcal{N} \mathbf{ \left( \mu, \Sigma \right) }$
([Definition](#def-mv-normal)) with $\mathbf{\Sigma}$ positive definite (so
$\mathbf{A} \in \mathbb{R}^{n \times n}$ is invertible).

Then $\mathbf{x}$ has probability density function

$$
f_{\mathbf{x}}(\mathbf{x})
=
\frac{1}{(2\pi)^{n/2} \, |\mathbf{\Sigma}|^{1/2}}
\exp \left(
-\frac{1}{2}
\mathbf{ (x-\mu)^\top \Sigma^{-1} (x-\mu) }
\right).
$$
///

/// proof | Proof of Multivariate PDF

**Density of the standard normal vector.** By
[Definition](../linear_models/linear_models.md#def-standard_normal){data-preview}
the components $(\mathbf{z}_i)_{i=1}^n$ are i.i.d. $\mathcal{N}(0,1)$, so the
joint density is the product of the marginals:

$$
\begin{align*}
f_{\mathbf{z}}(\mathbf{z})
&=
\prod_{i=1}^n \frac{1}{\sqrt{2\pi}} \exp \left( -\frac{z_i^2}{2} \right)
\\ &=
\frac{1}{(2\pi)^{n/2}}
\exp \left( -\frac{1}{2} \sum_{i=1}^n z_i^2 \right)
\\ &=
\frac{1}{(2\pi)^{n/2}}
\exp \left( -\frac{1}{2} \mathbf{z^\top z} \right).
\end{align*}
$$

**Change of variables.** Since $\mathbf{x = Az + \mu}$ with $\mathbf{A}$
invertible, the map is a bijection with inverse
$\mathbf{z = A^{-1}(x-\mu)}$ and Jacobian

$$
\frac{\partial \mathbf{z}}{\partial \mathbf{x}} = \mathbf{A^{-1}},
\qquad
\left| \det \mathbf{A^{-1}} \right| = \frac{1}{|\det \mathbf{A}|}.
$$

The change-of-variables formula for densities gives

$$
f_{\mathbf{x}}(\mathbf{x})
=
f_{\mathbf{z}}\!\left( \mathbf{A^{-1}(x-\mu)} \right)
\left| \det \mathbf{A^{-1}} \right|.
$$

**Simplifying the determinant.** From $\mathbf{A^\top A = \Sigma}$ and
multiplicativity of the determinant,

$$
|\mathbf{\Sigma}|
= \det(\mathbf{A^\top A})
= \det(\mathbf{A^\top}) \det(\mathbf{A})
= (\det \mathbf{A})^2,
$$

hence $|\det \mathbf{A}| = |\mathbf{\Sigma}|^{1/2}$ and
$\left| \det \mathbf{A^{-1}} \right| = |\mathbf{\Sigma}|^{-1/2}$.

**Simplifying the exponent.** Writing
$\mathbf{z = A^{-1}(x-\mu)}$,

$$
\begin{align*}
\mathbf{z^\top z}
&=
\mathbf{ \left( A^{-1}(x-\mu) \right)^\top A^{-1}(x-\mu) }
\\ &=
\mathbf{ (x-\mu)^\top (A^{-1})^\top A^{-1} (x-\mu) }
\\ &=
\mathbf{ (x-\mu)^\top (A A^\top)^{-1} (x-\mu) }.
\end{align*}
$$

Since $\mathbf{\Sigma}$ is symmetric and
$\mathbf{A^\top A = \Sigma}$ with $\mathbf{A}$ square invertible, we have
$\mathbf{(A A^\top)^{-1} = (A^\top)^{-1} A^{-1} = (A^\top A)^{-1} = \Sigma^{-1}}$,
so

$$
\mathbf{z^\top z} = \mathbf{ (x-\mu)^\top \Sigma^{-1} (x-\mu) }.
$$

**Conclusion.** Substituting the determinant and exponent results into the
change-of-variables formula,

$$
f_{\mathbf{x}}(\mathbf{x})
=
\frac{1}{(2\pi)^{n/2} \, |\mathbf{\Sigma}|^{1/2}}
\exp \left(
-\frac{1}{2}
\mathbf{ (x-\mu)^\top \Sigma^{-1} (x-\mu) }
\right).
\qquad \blacksquare
$$
///
