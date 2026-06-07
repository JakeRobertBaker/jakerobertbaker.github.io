<!-- snippets: latex_math -->
# Common Identities

## Linear Sum of Cols

$$
\text{Let }
A \in \mathbb{R}^{p \times p},\quad
B \in \mathbb{R}^{p \times q},\quad
C \in \mathbb{R}^{q \times p},\quad
D \in \mathbb{R}^{q \times q}
$$

Then,

TODO express concisely and then full dimension denoted one below

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

## Linear Sum of Rows

TODO: the exact same as you did above but the row version
