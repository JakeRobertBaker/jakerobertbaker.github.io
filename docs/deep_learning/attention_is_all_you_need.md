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

Positional encodings $PE_{\text{src}} : (S{=}5,\, D{=}512)$ are added elementwise (not concatenated):

$$
\mathbf{E}_{\text{src}} = \mathbf{X}_{\text{src}} + PE_{\text{src}} : (S{=}5,\, D{=}512)
$$

This is the input fed into the bottom of the encoder stack.

## Stage 2 — Encoder Stack (repeated $N = 6$ times)

Each encoder layer applies two sub-layers with a residual connection and LayerNorm around each: $\text{LayerNorm}(\mathbf{x} + \text{Sublayer}(\mathbf{x}))$.

My code instead does pre-norm: normalise, apply sub-layer, add residual:  $\text{Sublayer}( \text{LayerNorm}(\mathbf{x}) ) + \text{LayerNorm} (\mathbf{x})$ which has been seen to train stably.
