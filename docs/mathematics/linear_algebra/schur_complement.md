<!-- snippets: latex_math -->
Using the matrix multiplication row and column [identities](./matrix_multiplication.md).

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

and

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

We aim to remove $C$ from the lower entry of the matrix via column gausian elimination steps.

We just need to take the first col block minus second block col times $D^{-1}C$

$$
\begin{align*}
\begin{bmatrix}
A & B \\
C & D
\end{bmatrix}
\begin{bmatrix}
I_p \\
-D^{-1}C
\end{bmatrix} &=
\begin{bmatrix}
A \\
C
\end{bmatrix}
I_p
+
\begin{bmatrix}
B \\
D
\end{bmatrix}
(-D^{-1}C)
\\ &=
\begin{bmatrix}
A \\
C
\end{bmatrix}
+
\begin{bmatrix}
B (-D^{-1}C) \\
D (-D^{-1}C)
\end{bmatrix}
\\ &=
\begin{bmatrix}
A - BD^{-1}C \\
0
\end{bmatrix}
\end{align*}
$$

Also,

$$
\begin{bmatrix}
A & B \\
C & D
\end{bmatrix}
\begin{bmatrix}
0 \\
I_q
\end{bmatrix} =
\begin{bmatrix}
A \\
C
\end{bmatrix}
0
+
\begin{bmatrix}
B \\
D
\end{bmatrix}
I_q =
\begin{bmatrix}
B \\
D
\end{bmatrix}
$$

Hence

$$
\begin{bmatrix}
A & B \\
C & D
\end{bmatrix}
\begin{bmatrix}
I_p & 0 \\
-D^{-1}C & I_q
\end{bmatrix}
$$
