# Loss Comparison: CLIP vs SigLIP

Let $\mathbf{U}, \mathbf{V} \in \mathbb{R}^{N \times D}$ be the $\ell_2$-normalized image and text embeddings respectively.

Let $\mathbf{S} = \mathbf{U}\mathbf{V}^\top$ be the $N \times N$ matrix of cosine similarity scores, where $s_{ij} = \mathbf{u}_i \cdot \mathbf{v}_j$.

Let $t = e^{t'}$ be the learned temperature parameter.

---

## CLIP Loss

Defining the row-wise softmax probabilities:

$$
\hat{P}^{(I \to T)}_{ij} = \frac{e^{t \cdot s_{ij}}}{\sum_{c=1}^{N} e^{t \cdot s_{ic}}}
\qquad
\hat{P}^{(T \to I)}_{ij} = \frac{e^{t \cdot s_{ji}}}{\sum_{c=1}^{N} e^{t \cdot s_{ci}}}
$$

In general, for soft labels $y_{ij} \in [0,1]$ representing the affinity between image $i$ and text $j$:

$$
\begin{align*}
\mathcal{L}_{\text{CLIP}}(\mathbf{U}, \mathbf{V})
&= \frac{1}{2}
\left[ \mathbf{CE} \left( \hat{P}^{(I \to T)}, y \right) + \mathbf{CE} \left( \hat{P}^{(T \to I)}, y \right) \right]
\\
&= -\frac{1}{2N} \sum_{i=1}^{N} \sum_{j=1}^{N} y_{ij} \left[
\log \hat{P}^{(I \to T)}_{ij} + \log \hat{P}^{(T \to I)}_{ij}
\right]
\end{align*}
$$

Where $\mathbf{CE}$ is the cross entropy function,

$$
\mathbf{CE(P,y)} = \frac{1}{N} \sum_{i=1}^{N} \sum_{j=1}^{N} \mathbf{y}_{i,j} \log \left( \frac{1}{\mathbf{P}_{i,j}} \right)
$$

for general distribution matrices $\mathbf{P}, \mathbf{y}$.

In standard CLIP with hard labels:

- $y_{ij} = 1 \iff$ image $i$ corresponds to text $j$
- $y_{ij} = 0 \iff$ image $i$ does not correspond to text $j$

The loss becomes:

$$
\begin{align*}
\mathcal{L}_{\text{CLIP}}(\mathbf{U}, \mathbf{V})
&= -\frac{1}{2N} \sum_{i=1}^{N} \left[
\log \hat{P}^{(I \to T)}_{ii} + \log \hat{P}^{(T \to I)}_{ii}
\right]
\\
&=
-\frac{1}{2N} \sum_{i=1}^{N} \left[
\underbrace{\log \frac{e^{t \cdot s_{ii}}}{\sum_{j=1}^{N} e^{t \cdot s_{ij}}}}_{\text{image} \to \text{text}}
+
\underbrace{\log \frac{e^{t \cdot s_{ii}}}{\sum_{j=1}^{N} e^{t \cdot s_{ji}}}}_{\text{text} \to \text{image}}
\right]
\end{align*}
$$

Hence, CLIP uses a symmetric softmax-based contrastive loss (InfoNCE). For each image $i$, it treats the matching text $i$ as the correct class among $N$ candidates (and vice versa).

---

## SigLIP Loss

Defining the pairwise sigmoid probability:

$$
\hat{P}^{\text{sig}}_{ij} = \sigma(t \cdot s_{ij} - b) = \frac{1}{1 + e^{-(t \cdot s_{ij} - b)}}
$$

where $b$ is a learned bias term.

In general, for soft labels $y_{ij} \in [0,1]$ representing the affinity between image $i$ and text $j$:

$$
\begin{align*}
\mathcal{L}_{\text{SigLIP}}(\mathbf{U}, \mathbf{V})
&= \mathbf{BCE}\left( \hat{P}^{\text{sig}}, y \right)
\\
&= -\frac{1}{N} \sum_{i=1}^{N} \sum_{j=1}^{N} \left[
y_{ij} \log \hat{P}^{\text{sig}}_{ij} + (1 - y_{ij}) \log \left(1 - \hat{P}^{\text{sig}}_{ij}\right)
\right]
\end{align*}
$$

Where $\mathbf{BCE}$ is the binary cross entropy function,

$$
\mathbf{BCE(P, y)} = \frac{1}{N} \sum_{i=1}^{N} \sum_{j=1}^{N} \left[
\mathbf{y}_{ij} \log \frac{1}{\mathbf{P}_{ij}} + (1 - \mathbf{y}_{ij}) \log \frac{1}{1 - \mathbf{P}_{ij}}
\right]
$$

for general probability matrix $\mathbf{P}$ and label matrix $\mathbf{y}$.

In standard SigLIP with hard labels:

- $y_{ij} = 1 \iff$ image $i$ corresponds to text $j$ (positive pair)
- $y_{ij} = 0 \iff$ image $i$ does not correspond to text $j$ (negative pair)

The loss becomes:

$$
\begin{align*}
\mathcal{L}_{\text{SigLIP}}(\mathbf{U}, \mathbf{V})
&= -\frac{1}{N} \sum_{i=1}^{N} \left[
\log \hat{P}^{\text{sig}}_{ii} + \sum_{j \neq i} \log \left(1 - \hat{P}^{\text{sig}}_{ij}\right)
\right]
\\
&= -\frac{1}{N} \sum_{i=1}^{N} \sum_{j=1}^{N} \log \sigma\left( z_{ij} \cdot (t \cdot s_{ij} - b) \right)
\end{align*}
$$

where we use $z_{ij} = 2y_{ij} - 1 \in \{+1, -1\}$ and the identity $1 - \sigma(x) = \sigma(-x)$.

**Learnable parameters:**

- $t = e^{t'}$: temperature (initialized with $t' = \log 10$, so $t = 10$)
- $b$: bias term (initialized to $-10$)

The bias $b$ is crucial for training stability — it prevents large initial gradient updates from the heavy imbalance of $N^2 - N$ negative pairs vs $N$ positive pairs.

---

## Key Differences

| Property | CLIP | SigLIP |
|----------|------|--------|
| **Loss type** | Softmax (N-way classification) | Sigmoid (pairwise binary) |
| **Normalization** | Global across batch | Per-pair independent |
| **Symmetry** | Two passes (I→T and T→I) | Single symmetric pass |
| **Learnable params** | Temperature $t$ | Temperature $t$ + bias $b$ |
| **Memory** | $O(N^2)$ for full softmax | $O(N^2)$ but chunked-friendly |
