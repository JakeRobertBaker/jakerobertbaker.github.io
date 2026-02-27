<!-- snippets: latex_math -->
# Transformer End-to-End Flow

Notation is setup in [Attention Mechanisms](attention.md).

## Running Example

We translate the English sentence into French:

$$
\textbf{Source (English):} \quad \text{THE WEATHER IS LOVELY TODAY}
\quad (S = 5)
$$

$$
\textbf{Target (French):} \quad \text{LE TEMPS EST MAGNIFIQUE}
\quad (T = 4)
$$

The paper uses $N = 6$ encoder and decoder layers, $h = 8$ attention heads, $D = 512$, $D_h = D_k = D_v = 64$.

## Stage 1 — Source Embedding + Positional Encoding

The source sentence is tokenised and each token is looked up in the embedding table.

$$
\begin{bmatrix}
\text{THE} \\
\text{WEATHER} \\
\text{IS} \\
\text{LOVELY} \\
\text{TODAY}
\end{bmatrix}
\mapsto
\begin{bmatrix}
105 \\
12 \\
24 \\
107 \\
57
\end{bmatrix}
\mapsto
\mathbf{X}_{\text{src}} : (S{=}5,\, D{=}512)
$$

### Positional Encoding

Positional encodings $PE_{\text{src}} : (S{=}5,\, D{=}512)$ are added elementwise (not concatenated),
for each position
$s \in \left\{1,...,S \right\}$
and dimension index
$d \in \left\{ 1,\dots,D \right\}$ taking either $2i+1$ or $2i$

$$
PE_{\text{src}} :(S,D)  =
\begin{cases}
\begin{aligned}
PE_{\text{src}} \left[ s, 2i \right]
&=
\sin \left( \dfrac{s}{10,000^{\left(\dfrac{2i}{D}\right)}} \right)
\\\\
PE_{\text{src}} \left[ s, 2i+1 \right]
&=
\cos \left( \dfrac{s}{10,000^{\left(\dfrac{2i}{D}\right)}} \right)
\end{aligned}
\end{cases}
$$

$$
\mathbf{E}_{\text{src}} = \mathbf{X}_{\text{src}} + PE_{\text{src}} : (S{=}5,\, D{=}512)
$$

This is the input fed into the bottom of the encoder stack.

## Stage 2 — Encoder Stack (repeated $N = 6$ times)

Each encoder layer applies two sub-layers with a residual connection and LayerNorm around each. $\text{LayerNormRes}$ is either:

$$
\text{LayerNormRes}_{\text{post}}(\mathbf{x}, \text{Sub}) = \text{LayerNorm}(\mathbf{x} + \text{Sub}(\mathbf{x}))
\\
\text{LayerNormRes}_{\text{pre}}(\mathbf{x}, \text{Sub}) = \text{Sub}(\text{LayerNorm}(\mathbf{x})) + \mathbf{x}
$$

The original paper uses post-norm; pre-norm (used in my code) has been found to train more stably. The full encoder layer is then:

$$
\mathbf{SL_1}(\mathbf{x}) = \text{LayerNormRes}\!\left(\mathbf{x},\; \text{MHA} \right) : (S{=}5,\, D{=}512)
\\[6pt]
\mathbf{SL_2}(\mathbf{x}) = \text{LayerNormRes}\!\left(\mathbf{x},\; \text{FFN} \right) : (S{=}5,\, D{=}512)
\\[6pt]
\mathbf{H}(\mathbf{x}) = \mathbf{SL_2}(\mathbf{SL_1}(\mathbf{x})) : (S{=}5,\, D{=}512)
$$

There are $N=6$ independent $\mathbf{H}_i$ layers. The output of one layer is direct input for the next.

$$
\mathbf{M}_1 = \mathbf{H}_1(\mathbf{E}_{\text{src}})
\\
\vdots
\\
\mathbf{M}_i = \mathbf{H}_i(\mathbf{M}_{i-1})
\\
\vdots
\\
\mathbf{M} = \mathbf{M}_N = \mathbf{H}_N(\mathbf{M}_{N-1}) : (S{=}5,\, D{=}512)
$$

Because of MHA $\mathbf{M}$ is like a context aware representative of every source token, informed by all other source tokens.

/// note | Remark — what the self-attention is comparing
    attrs: {id: rem-enc-self-attn}

Let's consider the first layer of the stack.

$$
\text{MHA}\!\left(\mathbf{E}_{\text{src}},\; \mathbf{E}_{\text{src}},\; \mathbf{E}_{\text{src}}\right) : (S{=}5,\, D{=}512)
$$

All three of $\mathbf{Q}, \mathbf{K}, \mathbf{V}$ are projections of the same matrix $\mathbf{E}_{\text{src}}$, so $\mathbf{Z}_{i,j} = \mathbf{q}_i \cdot \mathbf{k}_j$ measures how much **source token $i$ attends to source token $j$**. For example, token $i = \text{LOVELY}$ may learn to attend strongly to token $j = \text{TODAY}$, capturing their syntactic relationship. Output row $i$ is:

$$
\text{row}_i(\mathbf{A}) = \sum_{r=1}^{S} \alpha(\mathbf{q}_i, \mathbf{K}, r)\; \mathbf{v}_r^T
$$

a blend of all $S=5$ source value vectors, weighted by relevance to source position $i$.

A **padding mask** zeroes out attention to any padding tokens (not needed here since $S = 5$ with no padding, but applied in batched training).

///

### Sub-layer 2 — Feed-Forward Network

$$
\text{FFN}(\mathbf{x}) = \phi\!\left(\mathbf{x}\mathbf{W}_1 + \mathbf{b}_1\right)\mathbf{W}_2 + \mathbf{b}_2
$$

where $\phi$ is the activation function, $\mathbf{W}_1 : (D{=}512,\, D_{ff}{=}2048)$ and $\mathbf{W}_2 : (D_{ff}{=}2048,\, D{=}512)$. Applied identically and independently to each of the $S=5$ source token positions. The original paper uses $\phi = \text{ReLU}$; in practice GELU is commonly preferred:

$$
\text{ReLU}(\mathbf{x}) = \max(0,\, \mathbf{x})
\qquad\qquad
\text{GELU}(\mathbf{x}) \approx \mathbf{x} \cdot \sigma(1.702\,\mathbf{x})
$$
