<!-- snippets: latex_math -->
Using the matrix multiplication row and column [identities](./matrix_multiplication.md).

Let:

$$
A \in \mathbb{R}^{p \times p},\quad
B \in \mathbb{R}^{p \times q},\quad
C \in \mathbb{R}^{q \times p},\quad
D \in \mathbb{R}^{q \times q},
\quad
X_1 \in \mathbb{R}^{p \times l},\quad
X_2 \in \mathbb{R}^{q \times l}
$$

$$
M =
\begin{bmatrix}
A & B \\
C & D
\end{bmatrix}
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
\end{bmatrix} =
\begin{bmatrix}
A-BD^{-1}C & B \\
0 & D
\end{bmatrix}
$$

Similiarly we now want to remove the B component from

$$
\begin{bmatrix}
A-BD^{-1}C & B \\
0 & D
\end{bmatrix}
$$

via linear combinations of row blocks.

Let $A^\star = A - BD^{-1}C$.

Then

$$
\begin{bmatrix}
I_p & -BD^{-1}
\end{bmatrix}
\begin{bmatrix}
A^\star & B \\
0 & D
\end{bmatrix} =
I_p
\begin{bmatrix}
A^\star & B
\end{bmatrix} -
B D^{-1}
\begin{bmatrix}
0 & D
\end{bmatrix} =
\begin{bmatrix}
A^\star & 0
\end{bmatrix}
$$

Hence

$$
\begin{align*}
& \begin{bmatrix}
I_p & -BD^{-1} \\
0 & I_q
\end{bmatrix}
\begin{bmatrix}
A-BD^{-1}C & B \\
0 & D
\end{bmatrix}
&=
\begin{bmatrix}
A-BD^{-1}C & 0 \\
0 & D
\end{bmatrix}
\end{align*}
$$

Therefore

$$
\begin{align*}
\begin{bmatrix}
A-BD^{-1}C & 0 \\
0 & D
\end{bmatrix} &=
\begin{bmatrix}
I_p & -BD^{-1} \\
0 & I_q
\end{bmatrix}
\begin{bmatrix}
A-BD^{-1}C & B \\
0 & D
\end{bmatrix}
\\
&= \begin{bmatrix}
I_p & -BD^{-1}
\\
0 & I_q
\end{bmatrix}
\begin{bmatrix}
A & B \\
C & D
\end{bmatrix}
\begin{bmatrix}
I_p & 0 \\
-D^{-1}C & I_q
\end{bmatrix}
\\
&= \begin{bmatrix}
I_p & -BD^{-1}
\\
0 & I_q
\end{bmatrix}
M
\begin{bmatrix}
I_p & 0 \\
-D^{-1}C & I_q
\end{bmatrix}
\end{align*}
$$

Therefore

$$
\begin{align*}
M &=
\begin{bmatrix}
I_p & -BD^{-1}
\\
0 & I_q
\end{bmatrix}^{-1}
\begin{bmatrix}
A-BD^{-1}C & 0 \\
0 & D
\end{bmatrix}
\begin{bmatrix}
I_p & 0 \\
-D^{-1}C & I_q
\end{bmatrix}^{-1}
\\ &=
\begin{bmatrix}
I_p & BD^{-1}
\\
0 & I_q
\end{bmatrix}
\begin{bmatrix}
A-BD^{-1}C & 0 \\
0 & D
\end{bmatrix}
\begin{bmatrix}
I_p & 0 \\
D^{-1}C & I_q
\end{bmatrix}
\end{align*}
$$

Notice that block matricies have inverse defined by
TODO

Therefore

$$
\begin{align*}
M^{-1} &=
\begin{bmatrix}
I_p & 0 \\
-D^{-1}C & I_q
\end{bmatrix}
\begin{bmatrix}
A-BD^{-1}C & 0 \\
0 & D
\end{bmatrix}^{-1}
\begin{bmatrix}
I_p & -BD^{-1}
\\
0 & I_q
\end{bmatrix}
\\ &=
\begin{bmatrix}
I_p & 0 \\
-D^{-1}C & I_q
\end{bmatrix}
\begin{bmatrix}
(A-BD^{-1}C)^{-1} & 0 \\
0 & D^{-1}
\end{bmatrix}
\begin{bmatrix}
I_p & -BD^{-1}
\\
0 & I_q
\end{bmatrix}
\\ &=
\begin{bmatrix}
I_p & 0 \\
-D^{-1}C & I_q
\end{bmatrix}
\begin{bmatrix}
(A-BD^{-1}C)^{-1} & (A-BD^{-1}C)^{-1} (-BD^{-1}) \\
0 & D^{-1}
\end{bmatrix}
\\ &=
\begin{bmatrix}
(A-BD^{-1}C)^{-1} & (A-BD^{-1}C)^{-1} (-BD^{-1}) \\
-DC^{-1} (A-BD^{-1}C)^{-1}
&
D^{-1}C (A-BD^{-1}C)^{-1} BD^{-1} + D^{-1}
\end{bmatrix}
\end{align*}
$$
