<!-- snippets: latex_math -->
# Loss Comparison: CLIP vs SigLIP

Let $\mathbf{U}, \mathbf{V} \in \mathbb{R}^{N \times D}$ be the $\ell_2$-normalized image and text embeddings respectively.

Let $\mathbf{S} = \mathbf{U}\mathbf{V}^\top$ be the $N \times N$ matrix of cosine similarity scores, where $s_{ij} = \mathbf{u}_i \cdot \mathbf{v}_j$.

Let $t = e^{t'}$ be the learned temperature parameter.

---

## CLIP Loss

For a vector $\mathbf{x} \in \mathbb{R}^K$, the softmax function is defined as:

$$
\text{Softmax}(\mathbf{x})_k = \frac{e^{x_k}}{\sum_{c=1}^{K} e^{x_c}}, \qquad k = 1, \ldots, K
$$

Defining the row-wise softmax probabilities:

$$
\hat{\mathbf{P}}^{(I \to T)} = \text{row-Softmax}(t \cdot \mathbf{S}),
\qquad
\hat{\mathbf{P}}^{(T \to I)} = \text{row-Softmax}(t \cdot \mathbf{S}^\top)
$$

That is,

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
\left[ \mathbf{CE} \left( \hat{\mathbf{P}}^{(I \to T)}, \mathbf{Y} \right) + \mathbf{CE} \left( \hat{\mathbf{P}}^{(T \to I)}, \mathbf{Y} \right) \right]
\\
&= -\frac{1}{2N} \sum_{i=1}^{N} \sum_{j=1}^{N} y_{ij} \left[
\log \hat{P}^{(I \to T)}_{ij} + \log \hat{P}^{(T \to I)}_{ij}
\right]
\end{align*}
$$

Where $\mathbf{CE}$ is the cross entropy function. For probability vectors $\hat{\mathbf{p}}, \mathbf{y} \in \mathbb{R}^K$ over $K$ categories:

$$
\text{CE}(\hat{\mathbf{p}}, \mathbf{y}) = -\sum_{k=1}^{K} y_k \log \hat{p}_k
$$

For distribution matrices $\hat{\mathbf{P}} \in \mathbb{R}^{N \times K}$ and $\mathbf{Y} \in \mathbb{R}^{N \times K}$, where each row is a distribution over $K$ categories and $N$ is the batch size:

$$
\mathbf{CE}(\hat{\mathbf{P}}, \mathbf{Y}) = \frac{1}{N} \sum_{i=1}^{N} \text{CE}(\hat{\mathbf{P}}_{i,:},\; \mathbf{Y}_{i,:}) = -\frac{1}{N} \sum_{i=1}^{N} \sum_{k=1}^{K} y_{ik} \log \hat{P}_{ik}
$$

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

Note that binary cross entropy (BCE) is simply the $C = 2$ case of CE. For a single prediction $\hat{p} \in [0,1]$ and label $y \in \{0,1\}$, the distribution vectors are $\hat{\mathbf{p}} = (\hat{p},\; 1 - \hat{p})$ and $\mathbf{y} = (y,\; 1 - y)$, giving:

$$
\text{BCE}(\hat{p}, y) = \text{CE}\!\left((\hat{p},\; 1 - \hat{p}),\; (y,\; 1 - y)\right) = -\left[ y \log \hat{p} + (1 - y) \log(1 - \hat{p}) \right]
$$

Each pair $(i, j)$ contributes one such binary classification. Applying this to every pair:

$$
\begin{align*}
\mathcal{L}_{\text{SigLIP}}(\mathbf{U}, \mathbf{V})
&= \frac{1}{N^2} \sum_{(i,j) \in \{1,\ldots,N\}^2} \text{BCE}\!\left(\hat{P}^{\text{sig}}_{ij},\; y_{ij}\right)
\\
&= -\frac{1}{N^2} \sum_{i=1}^{N} \sum_{j=1}^{N} \left[
y_{ij} \log \hat{P}^{\text{sig}}_{ij} + (1 - y_{ij}) \log \left(1 - \hat{P}^{\text{sig}}_{ij}\right)
\right]
\end{align*}
$$

Equivalently, flattening the $(i,j)$ pairs into a single batch dimension of size $N^2$, this is just the matrix $\mathbf{CE}$ applied to an $N^2 \times 2$ matrix where each row contains $(\hat{P}^{\text{sig}}_{ij},\; 1 - \hat{P}^{\text{sig}}_{ij})$ with corresponding labels $(y_{ij},\; 1 - y_{ij})$:

$$
\mathcal{L}_{\text{SigLIP}}(\mathbf{U}, \mathbf{V}) = \mathbf{CE}\!\left(\hat{\mathbf{P}}_{\text{flat}},\; \mathbf{Y}_{\text{flat}}\right), \qquad \hat{\mathbf{P}}_{\text{flat}}, \mathbf{Y}_{\text{flat}} \in \mathbb{R}^{N^2 \times 2}
$$

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
