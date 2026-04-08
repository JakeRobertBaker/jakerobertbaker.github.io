<!-- snippets: latex_math -->
# Absorption Probability

In a Markov chain, every state $i \in I$ is either **transient** or **recurrent**. All absorbing states are recurrent, but not all recurrent states are absorbing. In most absorption problems the recurrent states *are* the absorbing states.

## Canonical Form

When the state space is partitioned into transient states $I_t$ and absorbing states $I_r$, the transition matrix takes the block form

$$
P =
\begin{bmatrix}
Q & R \\
0 & I
\end{bmatrix}
$$

where $Q$ is the sub-stochastic matrix of transitions among transient states and $R$ records transitions from transient states into absorbing states.

## Fundamental Matrix

Transient and recurrent states are characterised by

$$
\begin{align*}
i \text{ is recurrent} &\iff \sum_{n=0}^{\infty} p_{i,i}^{(n)} = \infty \\
i \text{ is transient} &\iff \sum_{n=0}^{\infty} p_{i,i}^{(n)} < \infty \implies p_{i,j}^{(n)} \to 0.
\end{align*}
$$

Hence $Q^n \to 0$, so $(I - Q)$ is invertible with Neumann series

$$
(I - Q)^{-1} = I + Q + Q^2 + \cdots
$$

/// definition | Fundamental Matrix
    attrs: {id: def-fundamental-matrix}

$$
N = (I - Q)^{-1}
$$

///

/// definition | Visit Counter
    attrs: {id: def-visit-counter}

Let $V_j = \sum_{n=0}^{\infty} \mathbf{1}_{\{X_n = j\}}$ be the total number of visits to state $j$.

///

/// lemma | Fundamental Matrix is the expected number of visits
    attrs: {id: lem-expected-visits}

$$
N_{i,j} = \mathbb{E}_i(V_j),
$$

i.e. $N_{i,j}$ is the expected number of visits to transient state $j$ when starting from transient state $i$.

///

/// proof | Proof
$$
\begin{align*}
N_{i,j} &= \mathbb{E}_i\!\left(\sum_{n=0}^{\infty} \mathbf{1}_{\{X_n = j\}}\right) \\
&= \sum_{n=0}^{\infty} p_{i,j}^{(n)} \\
&= \sum_{n=0}^{\infty} (Q^n)_{i,j} \\
&= \bigl((I - Q)^{-1}\bigr)_{i,j}.
\end{align*}
$$
///

## Absorption Probability

/// theorem | Absorption Probability
    attrs: {id: thm-absorption-probability}

Let $i$ be a transient state and $k$ an absorbing state. The probability of being absorbed into the recurrent class of $k$ (via state $k$) is

$$
\mathbb{P}_i(\text{absorbed by } k) = (NR)_{i,k}.
$$

///

/// proof | Proof

Conditioning on successive steps through the transient states,

$$
\begin{align*}
&\mathbb{P}_i\!\left(\text{enter recurrent class of } k \text{ via state } k\right) \\
&= \sum_{t=0}^{\infty} \sum_{j \in I_t} \mathbb{P}_i(X_t = j)\, p_{j,k} \\
&= \sum_{t=0}^{\infty} \sum_{j \in I_t} (P^t)_{i,j}\, R_{j,k} \\
&= \sum_{j \in I_t} \left[\sum_{t=0}^{\infty} (Q^t)_{i,j}\right] R_{j,k} \\
&= \sum_{j \in I_t} (I-Q)^{-1}_{i,j}\, R_{j,k} \\
&= (NR)_{i,k}.
\end{align*}
$$

///
