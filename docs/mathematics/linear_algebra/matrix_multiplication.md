<!-- snippets: latex_math -->
<!-- snippets: latex_math -->
# Common Identities

## Linear Sum of Cols

$$
\text{Let }
A \in \mathbb{R}^{p \times p},\quad
B \in \mathbb{R}^{p \times q},\quad
C \in \mathbb{R}^{q \times p},\quad
D \in \mathbb{R}^{q \times q},
\quad
X_1 \in \mathbb{R}^{p \times l},\quad
X_2 \in \mathbb{R}^{q \times l}
$$

Then, concisely,

$$
\begin{bmatrix}
A & B \\
C & D
\end{bmatrix}
\begin{bmatrix}
X_1 \\
X_2
\end{bmatrix} =
\begin{bmatrix}
A \\
C
\end{bmatrix}
X_1
+
\begin{bmatrix}
B \\
D
\end{bmatrix}
X_2
$$

with dimensions,

$$
\begin{aligned}
&
\begin{array}{cc}
\begin{bmatrix}
A & B \\
C & D
\end{bmatrix}
&
\begin{bmatrix}
X_1 \\
X_2
\end{bmatrix}
\\
(p+q)\times(p+q)
&
(p+q)\times l
\end{array}
\\
&=
\begin{array}{c}
\begin{array}{cc}
\begin{bmatrix}
A \\
C
\end{bmatrix}
&
X_1
\\
(p+q)\times p
&
p\times l
\end{array}
\\
(p+q)\times l
\end{array}
+
\begin{array}{c}
\begin{array}{cc}
\begin{bmatrix}
B \\
D
\end{bmatrix}
&
X_2
\\
(p+q)\times q
&
q\times l
\end{array}
\\
(p+q)\times l
\end{array}
\end{aligned}
$$

Equivalently,

$$
\begin{bmatrix}
A & B \\
C & D
\end{bmatrix}
\begin{bmatrix}
X_1 \\
X_2
\end{bmatrix}
=
\begin{bmatrix}
AX_1 + BX_2 \\
CX_1 + DX_2
\end{bmatrix}
$$

## Linear Sum of Rows

$$
\text{Let }
A \in \mathbb{R}^{p \times p},\quad
B \in \mathbb{R}^{p \times q},\quad
C \in \mathbb{R}^{q \times p},\quad
D \in \mathbb{R}^{q \times q},
\quad
Y_1 \in \mathbb{R}^{l \times p},\quad
Y_2 \in \mathbb{R}^{l \times q}
$$

Then, concisely,

$$
\begin{bmatrix}
Y_1 & Y_2
\end{bmatrix}
\begin{bmatrix}
A & B \\
C & D
\end{bmatrix} =
Y_1
\begin{bmatrix}
A & B
\end{bmatrix}
+
Y_2
\begin{bmatrix}
C & D
\end{bmatrix}
$$

with dimensions,

$$
\begin{aligned}
&
\begin{array}{cc}
\begin{bmatrix}
Y_1 & Y_2
\end{bmatrix}
&
\begin{bmatrix}
A & B \\
C & D
\end{bmatrix}
\\
l\times(p+q)
&
(p+q)\times(p+q)
\end{array}
\\
&=
\begin{array}{c}
\begin{array}{cc}
Y_1
&
\begin{bmatrix}
A & B
\end{bmatrix}
\\
l\times p
&
p\times(p+q)
\end{array}
\\
l\times(p+q)
\end{array}
+
\begin{array}{c}
\begin{array}{cc}
Y_2
&
\begin{bmatrix}
C & D
\end{bmatrix}
\\
l\times q
&
q\times(p+q)
\end{array}
\\
l\times(p+q)
\end{array}
\end{aligned}
$$

Equivalently,

$$
\begin{bmatrix}
Y_1 & Y_2
\end{bmatrix}
\begin{bmatrix}
A & B \\
C & D
\end{bmatrix}
=
\begin{bmatrix}
Y_1A + Y_2C & Y_1B + Y_2D
\end{bmatrix}
$$
