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

/// definition | Positional Encoding
    attrs: {id: def-positional-encoding}

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
///

$$
\tilde{\mathbf{X}}_{\text{src}} = \mathbf{X}_{\text{src}} + PE_{\text{src}} : (S{=}5,\, D{=}512)
$$

This is the input fed into the bottom of the encoder stack.

## Stage 2 — Encoder Stack (repeated $N = 6$ times)

Each encoder layer applies two sub-layers with a residual connection and LayerNorm around each. $\text{LayerNormRes}$ is either:

$$
\text{LayerNormRes}_{\text{post}}(\mathbf{x}, \text{Sub}) = \text{LayerNorm}(\mathbf{x} + \text{Sub}(\mathbf{x}))
\\
\text{LayerNormRes}_{\text{pre}}(\mathbf{x}, \text{Sub}) = \text{Sub}(\text{LayerNorm}(\mathbf{x})) + \mathbf{x}
$$

The original paper uses post-norm; pre-norm (used in my code) has been found to train more stably. A single encoder layer $\mathbf{E}$ is:

$$
\mathbf{SL_1}(\mathbf{x}) = \text{LayerNormRes}\!\left(\mathbf{x},\; \text{MHA} \right) : (S{=}5,\, D{=}512)
\\[6pt]
\mathbf{SL_2}(\mathbf{x}) = \text{LayerNormRes}\!\left(\mathbf{x},\; \text{FFN} \right) : (S{=}5,\, D{=}512)
\\[6pt]
\mathbf{E}(\mathbf{x}) = \mathbf{SL_2}(\mathbf{SL_1}(\mathbf{x})) : (S{=}5,\, D{=}512)
$$

Where $\text{MHA}$ is defined in [Attention Mechanism](./attention.md#def-MHA){data-preview} and $\text{FFN}$ is defined below.

/// definition | FFN
    attrs: {id: def-ffn}

$$
\text{FFN}(\mathbf{x}) = \phi\!\left(\mathbf{x}\mathbf{W}_1 + \mathbf{b}_1\right)\mathbf{W}_2 + \mathbf{b}_2
$$

$\phi$ is the activation function, $\mathbf{W}_1 : (D{=}512,\, D_{ff}{=}2048)$ and $\mathbf{W}_2 : (D_{ff}{=}2048,\, D{=}512)$. The original paper uses $\phi = \text{ReLU}$; in practice GELU is commonly preferred:

$$
\text{ReLU}(\mathbf{x}) = \max(0,\, \mathbf{x})
\qquad\qquad
\text{GELU}(\mathbf{x}) \approx \mathbf{x} \cdot \sigma(1.702\,\mathbf{x})
$$
///

There are $N=6$ encoder layers $\mathbf{E}_1, \ldots, \mathbf{E}_N$, each with independent parameters. The output of one layer is the input to the next.

$$
\mathbf{M}_1 = \mathbf{E}_1(\tilde{\mathbf{X}}_{\text{src}})
\\
\vdots
\\
\mathbf{M}_i = \mathbf{E}_i(\mathbf{M}_{i-1})
\\
\vdots
\\
\mathbf{M} = \mathbf{M}_N = \mathbf{E}_N(\mathbf{M}_{N-1}) : (S{=}5,\, D{=}512)
$$

Because of MHA $\mathbf{M}$ is like a context-aware representation of every source token, informed by all other source tokens. It is passed **unchanged** into every one of the $N$ decoder layers.

/// note | Remark — what the self-attention is comparing
    attrs: {id: rem-enc-self-attn}

Let's consider the first layer of the stack.

$$
\text{MHA}\!\left(\tilde{\mathbf{X}}_{\text{src}},\; \tilde{\mathbf{X}}_{\text{src}},\; \tilde{\mathbf{X}}_{\text{src}}\right) : (S{=}5,\, D{=}512)
$$

All three of $\mathbf{Q}, \mathbf{K}, \mathbf{V}$ are projections of the same matrix $\tilde{\mathbf{X}}_{\text{src}}$, so $\mathbf{Z}_{i,j} = \mathbf{q}_i \cdot \mathbf{k}_j$ measures how much **source token $i$ attends to source token $j$**. For example, token $i = \text{LOVELY}$ may learn to attend strongly to token $j = \text{TODAY}$, capturing their syntactic relationship. Output row $i$ is:

$$
\text{row}_i(\mathbf{A}) = \sum_{r=1}^{S} \alpha(\mathbf{q}_i, \mathbf{K}, r)\; \mathbf{v}_r^T
$$

a blend of all $S=5$ source value vectors, weighted by relevance to source position $i$.

///

/// definition | Padding Mask
    attrs: {id: def-padding-mask}

A padding mask zeros out attention for any padding token.

$\sigma \left( \mathbf{QK^T} \right)_{i,j}$ is set to zero whenever query $i$ or key $j$'s token correspond to padding. Usually this is done via setting $\mathbf{QK^T}_{i,j}$ to negative infinity.

Equivalently, $\sigma \left(\mathbf{Z}  \right)_{i,j} = \sigma \left( \frac{\mathbf{QK^T}}{\sqrt{D_k}} \right)_{i,j} = \alpha(\mathbf{q}_i, \mathbf{K}, j)=0$ when $i$ or $j$ represent padding.
///

Note, this is not needed here since $S = 5$ with no padding, but applied in batched training.

---

## Stage 3 — Target Embedding + Positional Encoding (Training)

During training the full target sentence is known. The decoder is fed a **shifted-right** version of the target — prepending a special beginning-of-sequence token $\langle\text{BOS}\rangle$ and dropping the final token:

$$
\textbf{Target labels (what we predict):}
\quad
\mathbf{Y}_{\text{tgt}} =
\begin{bmatrix}
\text{LE} \\
\text{TEMPS} \\
\text{EST} \\
\text{MAGNIFIQUE}
\end{bmatrix}
\quad (T = 4)
$$

$$
\textbf{Decoder input (shifted right):}
\quad
\mathbf{X}_{\text{tgt}} =
\begin{bmatrix}
\langle\text{BOS}\rangle \\
\text{LE} \\
\text{TEMPS} \\
\text{EST}
\end{bmatrix}
\quad (T = 4)
$$

/// note | Remark — why shift right
    attrs: {id: rem-shift-right}

The shift means: the decoder at position $i$ must predict target token $i+1$ using only the tokens at positions $1, \ldots, i$. Seeing $\langle\text{BOS}\rangle$ it should predict LE; seeing $\langle\text{BOS}\rangle$, LE it should predict TEMPS; and so on. This is **teacher forcing** — the ground-truth tokens are fed in as input rather than the model's own previous predictions.
///

These $T=4$ shifted-right tokens are embedded and position-encoded in the same way as the source:

$$
\tilde{\mathbf{X}}_{\text{tgt}} = \mathbf{X}_{\text{tgt}} + PE_{\text{tgt}} : (T{=}4,\, D{=}512)
$$

---

## Stage 4 — Decoder Stack (repeated $N = 6$ times)

Each decoder layer has **three** sub-layers, each wrapped with a residual connection and LayerNorm (as in Stage 2). A single decoder layer $\mathbf{D}$ is:

$$
\mathbf{DL_1}(\mathbf{x}) = \text{LayerNormRes}\!\left(\mathbf{x},\; \text{MaskedMHA} \right) : (T, D)
\\[6pt]
\mathbf{DL_2}(\mathbf{x,M}) = \text{LayerNormRes}\!\left(\mathbf{x},\; \text{CrossMHA}(\,\cdot\,,\, \mathbf{M},\, \mathbf{M}) \right) : (T, D)
\\[6pt]
\mathbf{DL_3}(\mathbf{x}) = \text{LayerNormRes}\!\left(\mathbf{x},\; \text{FFN} \right) : (T, D)
\\[6pt]
\mathbf{D}(\mathbf{x,M}) = \mathbf{DL_3}(\mathbf{DL_2}(\mathbf{DL_1}(\mathbf{x}), \mathbf{M})) : (T, D)
$$

There are $N=6$ decoder layers $\mathbf{D}_1, \ldots, \mathbf{D}_N$, each with independent parameters. As with the encoder, the output of one layer is the input to the next. The encoder output $\mathbf{M}$ is passed **unchanged** into every decoder layer's cross-attention sub-layer.

$$
\mathbf{G}_1 = \mathbf{D}_1(\tilde{\mathbf{X}}_{\text{tgt}})
\\
\vdots
\\
\mathbf{G}_i = \mathbf{D}_i(\mathbf{G}_{i-1})
\\
\vdots
\\
\mathbf{G} = \mathbf{G}_N = \mathbf{D}_N(\mathbf{G}_{N-1}) : (T, D)
$$

### Sub-layer 1 — Masked Decoder Self-Attention

/// definition | Causal (Look-Ahead) Mask
    attrs: {id: def-causal-mask}

All entries with $j > i$ in the $T \times T = 4 \times 4$ score matrix $\mathbf{Z}$ are set to $-\infty$ before the softmax.

Therefore the attention weights become zero, $\alpha\left( \mathbf{q}_i, \mathbf{K},r \right)=0$ for all $r>i$.

Therefore, the weighted sum of values is restricted to positions up to and including $i$.

$$
\text{row}_i(\mathbf{A}) = \sum_{r=1}^{i} \alpha(\mathbf{q}_i, \mathbf{K}, r)\; \mathbf{v}_r^T
$$

This preserves the autoregressive property: position $i$ can only depend on positions $1, \ldots, i$.
///

Causal masked multi head attention measures how much the decoder representation of token $i$ attends to token $j$ for $j \leq i$.

For example, when $i = \text{EST}$ (position 4), the model can attend to $\langle\text{BOS}\rangle$, LE, TEMPS, and EST itself — but **not** to any later position.

The paper says:

> self-attention layers in the decoder allow each position in the decoder to attend to all positions in the decoder up to and including that position.

In practise the Masked Decoder MHA sublayer recieves a representation of the decoding $\mathbf{x} = \mathbf{\tilde{X}}_{\text{tgt}}$ or $\mathbf{G}_i,$ for $i \in \left\{ 1, \dots, N - 1 \right\}$ after the residual connection and LayerNorm:

$$
\mathbf{g}^{(1)} = \text{LayerNormRes}(\mathbf{x},\; \text{MaskedMHA}) : (T, D)
$$

### Sub-layer 2 — Encoder–Decoder Cross-Attention

$$
\text{MHA}\!\left(
\underbrace{\mathbf{g}^{(1)}}_{Q\,:\,(T{=}4,\;D{=}512)},\;\;
\underbrace{\mathbf{M}}_{K\,:\,(S{=}5,\;D{=}512)},\;\;
\underbrace{\mathbf{M}}_{V\,:\,(S{=}5,\;D{=}512)}
\right) : (T, D)
$$

Here the queries come from the decoder's current representation $\mathbf{g}^{(1)}$ and the keys/values come from the encoder's final output $\mathbf{M}$. The score matrix is $T \times S = 4 \times 5$ — each of the $T=4$ target positions attends over all $S=5$ source positions.

No causal mask is applied here — the decoder is free to attend to **any** source position when generating any target position. A **padding mask** is applied to suppress attention to any padded source positions.
/// note | Remark — what the cross-attention is comparing
    attrs: {id: rem-cross-attn}

The similarity $\mathbf{Z}_{i,j} = \mathbf{q}_i \cdot \mathbf{k}_j$ measures how much **target token $i$ attends to source token $j$**.

For example when generating $\mathbf{Y}_{\text{tgt}}$ every query representing $\mathbf{X}_{\text{tgt}}$ is allowed attend to all keys representing source $\mathbf{X}_{\text{tgt}}$

$$
\text{row}_i(\mathbf{A}) = \sum_{r=1}^{S} \alpha(\mathbf{q}_i, \mathbf{K}, r)\; \mathbf{v}_r^T
$$

For example when trying to generate $i=4$ target MAGNIFIQUE the query $\mathbf{q}_4$ for (shifted right target) EST is allowed to attend to all English states.
///

After the residual connection and LayerNorm:

$$
\mathbf{g}^{(2)} = \text{LayerNormRes}(\mathbf{g}^{(1)},\; \text{CrossMHA}) : (T, D)
$$

### Sub-layer 3 — Feed-Forward Network

Same structure as the encoder [FFN](#def-ffn){data-preview}, applied independently to each of the $T=4$ target positions.

$$
\mathbf{g}^{(3)} = \text{LayerNormRes}(\mathbf{g}^{(2)},\; \text{FFN}) : (T, D)
$$

---

## Stage 5 — Linear Projection + Softmax

The decoder output $\mathbf{G}$ is projected into vocabulary space and passed through a softmax to produce a predicted probability distribution over the vocabulary at each position:

$$
\hat{\mathbf{P}} = \text{softmax}\!\left(\mathbf{G}\,\mathbf{W}_O\right) : (T,\, |\mathcal{V}|)
$$

where $\mathbf{W}_O : (D,\, |\mathcal{V}|)$ is a learned linear projection. Row $i$ of $\hat{\mathbf{P}}$ is the model's predicted probability distribution over all vocabulary tokens for target position $i$.

/// note | Remark — weight tying
    attrs: {id: rem-weight-tying}

The paper shares the same weight matrix between the two embedding layers (source and target) and the pre-softmax linear transformation $\mathbf{W}_O$. In the embedding layers the weights are multiplied by $\sqrt{D}$.
///

Remember that due to the shifted-right decoder input, the predictions align as:

$$
\mathbf{X}_{\text{tgt}} =
\overbrace{
\begin{bmatrix}
\langle\text{BOS}\rangle \\
\text{LE} \\
\text{TEMPS} \\
\text{EST}
\end{bmatrix}
}^{\text{Decoder Input Position}}
\;\Rightarrow\;
\overbrace{
\begin{bmatrix}
\text{LE} \\
\text{TEMPS} \\
\text{EST} \\
\text{MAGNIFIQUE}
\end{bmatrix}
}^{\text{Model Predicts}}
= \mathbf{Y}_{\text{tgt}}
$$

---

## Stage 6 — Loss (Training Only)

Let $\mathbf{Y} : (T,\, |\mathcal{V}|)$ be the one-hot target matrix, where $\mathbf{Y}_{ik} = 1 \iff \mathbf{Y}_{\text{tgt},i}$ is token $k$ and is $0$ otherwise.

This defines a hard labelled distribution matrix that we can use in cross entropy loss defined in [CLIP losses](./clip_losses.md).

The cross-entropy loss is:

$$
\mathcal{L}(\mathbf{X}_{\text{src}}, \mathbf{X}_{\text{tgt}}, \mathbf{Y}_{\text{tgt}})
= \mathbf{CE} \left( \mathbf{\hat{P}}, \mathbf{Y} \right)
= -\frac{1}{T} \sum_{i=1}^{T} \sum_{k=1}^{|\mathcal{V}|} Y_{ik} \log \hat{P}_{ik}
$$

Since $\mathbf{Y}$ is one-hot, the inner sum collapses to a single non-zero term at the true token index $y_i = \text{the unique } k \in \mathcal{V} : \mathbf{Y}_{ik} = 1$

$$
\mathcal{L}(\mathbf{X}_{\text{src}}, \mathbf{X}_{\text{tgt}}, \mathbf{Y}_{\text{tgt}}) = -\frac{1}{T} \sum_{i=1}^{T} \log \hat{P}_{i,\, y_i}
$$

Gradients flow back through the decoder cross-attention, decoder self-attention, and encoder self-attention simultaneously, updating all projection matrices $\mathbf{W}^Q, \mathbf{W}^K, \mathbf{W}^V$ across all layers and heads.

---

## Inference — Autoregressive Decoding

Inference uses the same encoder and decoder but the decoder no longer receives the full target sequence upfront. Instead it generates one token at a time, feeding each prediction back as input for the next step.

**Step 1 — Encode the source once.** The encoder applies all $N=6$ stacked layers in a single call:

$$
\mathbf{M} = \text{Encoder}\!\left(\tilde{\mathbf{X}}_{\text{src}},\; \text{src\_pad\_mask}\right) : (S, D)
$$

$\mathbf{M}$ is computed once and reused at every generation step.

**Step 2 — Generate token by token.** Let $\tilde{\mathbf{X}}_{\text{tgt}}^{(t)} : (t, D)$ denote the embedded, position-encoded sequence of the $t$ tokens generated so far (starting from $\langle\text{BOS}\rangle$). The decoder applies all $N=6$ stacked layers:

$$
\mathbf{G}^{(t)} = \text{Decoder}\!\left(\tilde{\mathbf{X}}_{\text{tgt}}^{(t)},\; \mathbf{M},\; \text{src\_pad\_mask}\right) : (t, D)
$$

The next predicted token is taken from the **last row** of $\mathbf{G}^{(t)}$:

$$
\hat{y}_t = \arg\max_k\; \text{softmax}\!\left(\mathbf{G}^{(t)}_{t,\,:}\; \mathbf{W}_O\right)_k
$$

| Step $t$ | $\tilde{\mathbf{X}}_{\text{tgt}}^{(t)}$ (decoder input) | $\hat{y}_t$ (predicted token) |
|---|---|---|
| 1 | $\langle\text{BOS}\rangle$ | LE |
| 2 | $\langle\text{BOS}\rangle$, LE | TEMPS |
| 3 | $\langle\text{BOS}\rangle$, LE, TEMPS | EST |
| 4 | $\langle\text{BOS}\rangle$, LE, TEMPS, EST | MAGNIFIQUE |
| 5 | $\langle\text{BOS}\rangle$, LE, TEMPS, EST, MAGNIFIQUE | $\langle\text{EOS}\rangle$ |

The causal mask is still applied inside the decoder at each step, consistent with causality since $\tilde{\mathbf{X}}_{\text{tgt}}^{(t)}$ only ever contains tokens $1, \ldots, t$.

Generation terminates when $\langle\text{EOS}\rangle$ is produced or a maximum length is reached.

/// note | Remark — training vs inference
    attrs: {id: rem-inference}

During training, all $T=4$ target tokens are processed **in parallel** by a single decoder call (with the causal mask enforcing causality). This is what makes training efficient. During inference, the decoder is called **sequentially** $T{+}1$ times — each step's output token becomes part of the next step's input — since the true targets are unknown. The causal mask and the shifted-right convention together ensure that training exactly mimics the conditional dependencies seen at inference time.
///

---

## Masking Summary

| Mask Type | Where Applied | What It Does |
|---|---|---|
| **Causal (look-ahead) mask** | Decoder sub-layer 1 (masked self-attention) | Sets $\mathbf{Z}_{i,j} \to -\infty$ for $j > i$ in the $T \times T$ score matrix, preventing target token $i$ from attending to future target tokens $j$. Preserves the autoregressive property. |
| **Padding mask** | Encoder self-attention; Decoder cross-attention | Sets $\mathbf{Z}_{i,j} \to -\infty$ for any $j$ corresponding to a padding token. Prevents real tokens from drawing information from padding positions which carry no meaning. |

In both cases, setting scores to $-\infty$ before the softmax drives the corresponding $\alpha$ weights to zero, so those value vectors $\mathbf{v}_j$ contribute nothing to the output row.
