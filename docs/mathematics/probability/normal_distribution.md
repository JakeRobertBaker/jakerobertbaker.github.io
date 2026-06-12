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
\left( x+d \right)-
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

Where $\mathbf{z} \in \mathbb{R}^l, l\leq n$ is a [standard normal vector](../linear_models/linear_models.md#def-standard_normal){data-preview}.
///

### SPD

Note: $\mathbf{A^\top A = \Sigma}$ is equivalent to $\mathbf{\Sigma}$ being Semi Positive Definite.

### PDF

Assume $\Sigma$ is strictly positive definite. Then $\operatorname{rank}\mathbf{A} = \operatorname{rank}\mathbf{\Sigma} = n$,
and since $l \leq n$ this forces $l = n$, so $\mathbf{A} \in \mathbb{R}^{n \times n}$
is invertible.

/// lemma | Multivariate PDF
    attrs: {id: lem-MV-normal-pdf}

Let $\mathbf{x} \sim \mathcal{N} \mathbf{ \left( \mu, \Sigma \right) }$
([Definition](#def-mv-normal)) with $\mathbf{\Sigma}$ (strictly) positive
definite. Then $\mathbf{x}$ has probability density function

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

/// lemma | Conditional Gaussian
    attrs: {id: lem-conditional-gausian}

Let

$$
\mathbf{x} =
\begin{bmatrix}
\mathbf{x}_1\\
\mathbf{x}_2
\end{bmatrix}
\sim
\mathcal{N}
\left(
\begin{bmatrix}
\mathbf{\mu}_1\\
\mathbf{\mu}_2
\end{bmatrix},
\begin{bmatrix}
\mathbf{\Sigma}_{11} & \mathbf{\Sigma}_{12}\\
\mathbf{\Sigma}_{21} & \mathbf{\Sigma}_{22}
\end{bmatrix}
\right),
$$

where $\mathbf{\Sigma}$ is strictly positive definite. Define

$$
\mathbf{S}
:=
\mathbf{\Sigma}_{11} -
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}.
$$

Then

$$
\mathbf{x}_1 \mid \mathbf{x}_2
\sim
\mathcal{N}
\left(
\mathbf{\mu}_1
+
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}
\left(\mathbf{x}_2-\mathbf{\mu}_2\right),
\mathbf{S}
\right).
$$

///

/// proof | Proof of conditional-gaussian-proof
    open: true

We already know that the posterior is a valid distribution that integrates to 1. Therefore we just need to show that it is proprtional to that normal distribution up to scalars that are constant when we consider variables $\mathbf{x}_1$ and $\mathbf{x}_2$.

$$
p(\mathbf{x}_1\mid\mathbf{x}_2)
=
\frac{p(\mathbf{x}_1,\mathbf{x}_2)}{p(\mathbf{x}_2)}
\propto
\exp\left(-\frac{1}{2}\Delta\right),
$$

$$
\begin{align*}
\Delta &=
\textcolor{cyan}{
\begin{bmatrix}
\mathbf{x}_1 \\
\mathbf{x}_2
\end{bmatrix}^{\!\top}
\mathbf{\Sigma}^{-1}
\begin{bmatrix}
\mathbf{x}_1\\
\mathbf{x}_2
\end{bmatrix}} -
\textcolor{red}{2
\begin{bmatrix}
\mathbf{x}_1\\
\mathbf{x}_2
\end{bmatrix}^{\!\top}
\mathbf{\Sigma}^{-1}
\begin{bmatrix}
\mathbf{\mu}_1\\
\mathbf{\mu}_2
\end{bmatrix}} -
\textcolor{yellow}{\mathbf{x}_2^\top \mathbf{\Sigma}_{22}^{-1}\mathbf{x}_2}
+
\textcolor{yellow}{2\mathbf{x}_2^\top \mathbf{\Sigma}_{22}^{-1}\mathbf{\mu}_2}.
\end{align*}
$$

Let

$$
\mathbf{S}
:=
\mathbf{\Sigma}_{11} -
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21},
\qquad
\text{notice } \mathbf{S}=\mathbf{S}^\top.
$$

Then

$$
\mathbf{\Sigma}^{-1} =
\begin{bmatrix}
\mathbf{S}^{-1} & -
\mathbf{S}^{-1}\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}
\\ -
\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1} &
\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1} +
\mathbf{\Sigma}_{22}^{-1}
\end{bmatrix}.
$$

Substituting this into $\Delta$ gives

$$
\begin{align*}
\Delta &=
\textcolor{cyan}{\mathbf{x}_1^\top \mathbf{S}^{-1}\mathbf{x}_1} -
\textcolor{cyan}{\mathbf{x}_1^\top \mathbf{S}^{-1}\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{x}_2} -
\textcolor{cyan}{\mathbf{x}_2^\top \mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}\mathbf{x}_1}
\\
&\quad +
\textcolor{cyan}{\mathbf{x}_2^\top
\left(
\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}
\right)
\mathbf{x}_2}
+
\textcolor{cyan}{\mathbf{x}_2^\top\mathbf{\Sigma}_{22}^{-1}\mathbf{x}_2}
\\
&\quad
-
\textcolor{red}{2\mathbf{x}_1^\top\mathbf{S}^{-1}\mathbf{\mu}_1}
+
\textcolor{red}{2\mathbf{x}_1^\top\mathbf{S}^{-1}\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{\mu}_2}
+
\textcolor{red}{2\mathbf{x}_2^\top\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}\mathbf{\mu}_1}
\\
&\quad
-
\textcolor{red}{2\mathbf{x}_2^\top
\left(
\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}
\right)
\mathbf{\mu}_2}
-
\textcolor{red}{2\mathbf{x}_2^\top\mathbf{\Sigma}_{22}^{-1}\mathbf{\mu}_2}
\\
&\quad
-
\textcolor{yellow}{\mathbf{x}_2^\top\mathbf{\Sigma}_{22}^{-1}\mathbf{x}_2}
+
\textcolor{yellow}{2\mathbf{x}_2^\top\mathbf{\Sigma}_{22}^{-1}\mathbf{\mu}_2}
\\
% second equals block
&=
\mathbf{x}_1^\top \mathbf{S}^{-1}\mathbf{x}_1
-
\mathbf{x}_1^\top \mathbf{S}^{-1}\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{x}_2
-
\mathbf{x}_2^\top \mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}\mathbf{x}_1
\\ &\quad +
\mathbf{x}_2^\top
\left(
\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}
\right)
\mathbf{x}_2
\\
&\quad
-
2\mathbf{x}_1^\top\mathbf{S}^{-1}\mathbf{\mu}_1
+
2\mathbf{x}_1^\top\mathbf{S}^{-1}\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{\mu}_2
+
2\mathbf{x}_2^\top\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}\mathbf{\mu}_1
\\
&\quad
-
2\mathbf{x}_2^\top
\left(
\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}
\right)
\mathbf{\mu}_2.
\\
% third equals block
&=
\textcolor{teal}{
\mathbf{x}_1^\top \mathbf{S}^{-1}\mathbf{x}_1
}
\\ & \quad +
\textcolor{pink}{
\left(
-2 \mathbf{x_2}^\top \mathbf{\Sigma}_{22}^{-1} \mathbf{\Sigma}_{21} \mathbf{S^{-1}}
-2 \mathbf{\mu}_1^\top \mathbf{S}^{-1}
+2 \mathbf{\mu}_2^\top \mathbf{\Sigma}_{22}^{-1} \mathbf{\Sigma}_{21} \mathbf{S}^{-1}
\right)
\mathbf{x}_1
}
\\ & \quad +
\mathbf{x}_2^\top
\Big(
\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}
\mathbf{x}_2
+ 2\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}\mathbf{\mu}_1
\\
& \quad \quad \quad - 2
\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}
\mathbf{\mu}_2
\Big)
\\
% fourth equals blocl
&=
\textcolor{teal}{
\mathbf{x}_1^\top \mathbf{S}^{-1}\mathbf{x}_1
}
\\ & \quad +
\textcolor{pink}{
\left(
-2 \mathbf{x_2}^\top \mathbf{\Sigma}_{22}^{-1} \mathbf{\Sigma}_{21}
-2 \mathbf{\mu}_1^\top
+2 \mathbf{\mu}_2^\top \mathbf{\Sigma}_{22}^{-1} \mathbf{\Sigma}_{21}
\right)
\mathbf{S}^{-1} \mathbf{x}_1
}
\\ & \quad +
\mathbf{x}_2^\top\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}
\left(
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{x}_2
+2\mathbf{\mu}_1
-2\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{\mu}_2
\right)
\\
% fifth equals blocl
&=
\textcolor{teal}{
\mathbf{x}_1^\top \mathbf{S}^{-1}\mathbf{x}_1
}
\\ & \quad +
\textcolor{pink}{
2 \left(
\left(
- \mathbf{x_2}^\top
+ \mathbf{\mu}_2^\top
\right)
\mathbf{\Sigma}_{22}^{-1} \mathbf{\Sigma}_{21}
- \mathbf{\mu}_1^\top
\right)
\mathbf{S}^{-1} \mathbf{x}_1
}
\\ & \quad +
\underbrace{
\mathbf{x}_2^\top\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}
\left(
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{x}_2
+2\mathbf{\mu}_1
-2\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{\mu}_2
\right)
}_{\eqqcolon \textcolor{cyan}{\gamma}}.
\end{align*}
$$

Now take

$$
\mathbf{H}=\mathbf{S}^{-1},
\qquad
\mathbf{c}=\mathbf{S}^{-1}
\left(
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}(\mathbf{\mu}_2-\mathbf{x}_2)
-
\mathbf{\mu}_1
\right),
$$

so

$$
\mathbf{d}=\mathbf{H}^{-1}\mathbf{c}
=\mathbf{S}\mathbf{c}
=
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}(\mathbf{\mu}_2-\mathbf{x}_2)
-
\mathbf{\mu}_1.
$$

Also,

$$
\begin{align*}
\mathbf{d}^\top\mathbf{H}\mathbf{d}
&=
\mathbf{d}^\top\mathbf{c}
=
\mathbf{c}^\top\mathbf{H}^{-\top}\mathbf{c}
=
\mathbf{c}^\top\mathbf{S}\mathbf{c}
\\
&=
\left(
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}(\mathbf{\mu}_2-\mathbf{x}_2)
-
\mathbf{\mu}_1
\right)^\top
\mathbf{S}^{-1}
\left(
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}(\mathbf{\mu}_2-\mathbf{x}_2)
-
\mathbf{\mu}_1
\right)
\\
&=
\left(
(\mathbf{x}_2-\mathbf{\mu}_2)^\top\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}
+
\mathbf{\mu}_1^\top
\right)
\mathbf{S}^{-1}
\left(
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}(\mathbf{x}_2-\mathbf{\mu}_2)
+
\mathbf{\mu}_1
\right)
\\
&=
(\mathbf{x}_2-\mathbf{\mu}_2)^\top
\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}
(\mathbf{x}_2-\mathbf{\mu}_2)
\\
&\quad
+2(\mathbf{x}_2-\mathbf{\mu}_2)^\top
\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}\mathbf{\mu}_1
+
\mathbf{\mu}_1^\top\mathbf{S}^{-1}\mathbf{\mu}_1
\\
&=
\mathbf{x}_2^\top\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{x}_2
-2\mathbf{\mu}_2^\top\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{x}_2
\\
&\quad
+2\mathbf{x}_2^\top\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}\mathbf{\mu}_1
+
\operatorname{constant}
\\
&=
\mathbf{x}_2^\top\mathbf{\Sigma}_{22}^{-1}\mathbf{\Sigma}_{21}\mathbf{S}^{-1}
\left(
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{x}_2
-2\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}\mathbf{\mu}_2
+2\mathbf{\mu}_1
\right)
+
\operatorname{constant}
\\
&=
\textcolor{cyan}{\gamma}
+
\operatorname{constant}.
\end{align*}
$$

Hence, using [Complete The Matrix Square](#lem-matrix-complete-square),

$$
\begin{align*}
\Delta
&=
\mathbf{x}_1^\top\mathbf{H}\mathbf{x}_1
+2\mathbf{c}^\top\mathbf{x}_1
+
\textcolor{cyan}{\gamma}
\\
&=
(\mathbf{x}_1+\mathbf{d})^\top\mathbf{H}(\mathbf{x}_1+\mathbf{d})
-
\mathbf{d}^\top\mathbf{H}\mathbf{d}
+
\textcolor{cyan}{\gamma}
\\
&=
(\mathbf{x}_1+\mathbf{d})^\top\mathbf{H}(\mathbf{x}_1+\mathbf{d})
+
\operatorname{constant}.
\end{align*}
$$

But

$$
\mathbf{x}_1+\mathbf{d}
=
\mathbf{x}_1
-
\left(
\mathbf{\mu}_1
+
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}(\mathbf{x}_2-\mathbf{\mu}_2)
\right),
$$

and $\mathbf{H}=\mathbf{S}^{-1}$. Therefore

$$
\begin{align*}
p(\mathbf{x}_1\mid\mathbf{x}_2)
&\propto
\exp\left(
-\frac{1}{2}
\left(
\mathbf{x}_1
-
\mathbf{\mu}_1
-
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}(\mathbf{x}_2-\mathbf{\mu}_2)
\right)^\top
\mathbf{S}^{-1}
\right.\\
&\hspace{4.5cm}\left.
\left(
\mathbf{x}_1
-
\mathbf{\mu}_1
-
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}(\mathbf{x}_2-\mathbf{\mu}_2)
\right)
\right).
\end{align*}
$$

This is proportional to a Gaussian with mean
$\mathbf{\mu}_1+\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}(\mathbf{x}_2-\mathbf{\mu}_2)$
and covariance $\mathbf{S}$. Since
$p(\mathbf{x}_1\mid\mathbf{x}_2)=p(\mathbf{x}_1,\mathbf{x}_2)/p(\mathbf{x}_2)$
already has volume $1$, this proportional Gaussian is the conditional density.
Thus

$$
\mathbf{x}_1\mid\mathbf{x}_2
\sim
\mathcal{N}
\left(
\mathbf{\mu}_1
+
\mathbf{\Sigma}_{12}\mathbf{\Sigma}_{22}^{-1}(\mathbf{x}_2-\mathbf{\mu}_2),
\mathbf{S}
\right).
\qquad \blacksquare
$$
///
