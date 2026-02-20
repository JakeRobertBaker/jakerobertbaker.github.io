# Attention Transformer Details

## Notation

/// note | Notation
    attrs: {id: not-attention}

Let $(S, D)$ denote the shape $\mathbb{R}^{S \times D}$ and write $\mathbf{X} \in \mathbb{R}^{S \times D}$ as $\mathbf{X} : (S, D)$.

- $S, T$ denote sequence lengths (source and target respectively)
- $D$ denotes the model embedding dimension
- $D_k, D_v, D_q$ denote key, value, and query dimensions
- $h$ denotes the number of attention heads, with $D_h \coloneqq D/h$

///

## Input Embeddings

The raw text is a sequence of vocabulary terms. Tokenization is the process of splitting the sentence into a sequence of vocabulary terms. Vocab terms can be single words but often tokenizers split the sentences into smaller components than words. In illustrative examples we usually show tokens as words.

/// example | Input Embeddings
    attrs: {id: exm-input_embeds}

$S=5$, $D$ is usually 512 in the traditional paper.

$$
\begin{align*}
\begin{bmatrix}
\text{THE} \\
\text{WEATHER} \\
\text{IS} \\
\text{LOVELY} \\
\text{TODAY}
\end{bmatrix}
&\mapsto
\begin{bmatrix}
105 \\
12 \\
24 \\
107 \\
57
\end{bmatrix}
&&\mapsto
\begin{bmatrix}
\mathbf{x_1^T} \\
\mathbf{x_2^T} \\
\mathbf{x_3^T} \\
\mathbf{x_4^T} \\
\mathbf{x_5^T}
\end{bmatrix}
\\ \\
\text{Sentence}
&\mapsto
\text{Input IDs}
&&\mapsto
\text{Embedding}:(5,D)
\end{align*}
$$
///

## Positional Encoding

Fixed definition for each position
$p \in \left\{1,...,S \right\}$
and dimension index
$2i \text{ or } 2i+1 \text{ for } i \in \left\{1,...,D \right\}$.

$$
PE :(S,D)  =
\begin{cases}
PE_{p, 2i}     &=&   \sin \left( \dfrac{p}{10,000^{\left(\dfrac{2i}{D}\right)}} \right)
\\
\\
PE_{p, 2i+1}   &=&   \cos \left( \dfrac{p}{10,000^{\left(\dfrac{2i}{D}\right)}} \right)
\end{cases}
$$

### Model Input

Model recieves $X + PE : (S,D)$

## Self Attention

This mechanism is what changed everything.

### Attention Definition

Let Query, Key and Value Matricies be $\mathbf{Q}:(T,D_k)$, $\mathbf{K}:(S,D_k)$ and $\mathbf{V}:(S,D_v)$. We also let $T \in \mathbb{N}$ denote a sequence length not neccessarily equal to $S \in \mathbb{N}$.

/// definition | Attention
    attrs: {id: def-Attention}

$\text{Attention}: (T,D_k) \times (S,D_k) \times (S,D_v) \to (T,D_v)$ maps

$$
\mathbf{Q,K,V} \mapsto
\sigma \left( \dfrac{\mathbf{Q K^T}}{\sqrt{D_k}} \right) \mathbf{V}
: (T,D_v)
$$
for row wise softmax $\sigma$
///

### Explanation

Write the matricies as,

$$
\mathbf{Q}=
\begin{bmatrix}
   \mathbf{q_1^T}   \\
   \vdots   \\
   \mathbf{q_S^T}
\end{bmatrix}
\mathbf{K}=
\begin{bmatrix}
   \mathbf{k_1^T}   \\
   \vdots   \\
   \mathbf{k_S^T}
\end{bmatrix}
\mathbf{V}=
\begin{bmatrix}
   \mathbf{v_1^T}   \\
   \vdots   \\
   \mathbf{v_S^T}
\end{bmatrix}
\text{for }
\mathbf{q_i, k_i, v_i} \in \mathbb{R}^{D_v}, i=1,...,S
$$

We see that
$\mathbf{Z}_{i,j}\coloneqq \mathbf{QK^T}_{i,j} = \mathbf{q_i \cdotp k_j}$
is like a similarity score between query $i$ and key $j$.

#### Compatibility Function

If we observe the softmax applied to $\mathbf{Z}$, we see that each element is a compatibility function, $\alpha$, between query $i$ and key $j$.

$$
\begin{align*}
\sigma \left( \mathbf{Z} \right)_{i,j}
&=
\cfrac{
   \exp \left( \frac{1}{\sqrt{D_k}} \mathbf{Z}_{i,j} \right)
   }
   {\sum_{r=1}^S \exp \left( \frac{1}{\sqrt{D_k}} \mathbf{Z}_{i,r} \right)
   }
\\
&=
\cfrac{
   \exp \left( \frac{1}{\sqrt{D_k}} \mathbf{q_i \cdotp k_j} \right)
   }
   {\sum_{r=1}^S \exp \left( \frac{1}{\sqrt{D_k}} \mathbf{q_i \cdotp k_r} \right)
   } =
\cfrac{\text{score}(i,j)}{\sum_{r=1}^S \text{score}(i,r)}
\eqqcolon
\alpha(\mathbf{q_i},\mathbf{K},j)
\end{align*}
$$

Let
$\mathbf{A} \coloneqq \text{Attention}(\mathbf{Q,K,V})$, then

$$
\begin{align*}
\mathbf{A}_{i,j}
= \sum_{r=1}^S \sigma \left( \mathbf{Z} \right)_{i,r}  \mathbf{V}_{r,j}
&= \sum_{r=1}^S \alpha(\mathbf{q_i},\mathbf{K},r) [\mathbf{v_r}]_j
\\
\implies
\text{row}_i \left( \mathbf{A} \right)
&= \sum_{r=1}^S \alpha(\mathbf{q_i},\mathbf{K},r) \mathbf{v_r^T}
\in \mathbb{R}^{1,D_v}
\end{align*}
$$

row $i$ of $\mathbf{A}$ is the sum of values, each weighted by query $i$'s similarity with that key.

### Remarks

/// note | Attention is permutation invariant
    attrs: {id: rem-attention-permutation}

Notice that row $i$ of $\mathbf{A}$ is a function of $\mathbf{q_i, K,V}$,

$$
\text{row}_i \left( \mathbf{A} \right) =
\sum_{r=1}^S \alpha(\mathbf{q_i},\mathbf{K},r) \mathbf{v_r^T}
\eqqcolon f(\mathbf{q_i, K,V})
$$

Therefore if we permute two rows of A, the output of Attention has the same two rows permuted.
///

## Muti Head Attention

Let $\mathbf{Q}:(T,D_q), \mathbf{K}:(S,D_k), \mathbf{V}:(S,D_v)$.

/// definition | Multi Head Attention
    attrs: {id: def-MHA}

Given sequence lengths $S, T \in \mathbb{N}$, dimension lengths $D_q, D_k, D_v, D \in \mathbb{N}$, $h\in \mathbb{N}$ that divides $D$ and parameters $\mathbf{W_i^Q, W_i^K, W_i^V}$, for $i=1,...,h$.

$\text{MultiHeadAttention}: (T,D_q) \times (S,D_k) \times (S,D_v) \to (T,D)$ maps

$$
\begin{split}
\mathbf{Q,K,V}
 \mapsto
\left[ \mathbf{H_1},...,\mathbf{H_h} \right]
: (T,D)
\\ \\
\mathbf{H_i}
 \coloneqq
\text{Attention} \left( \mathbf{Q'_i}, \mathbf{K'_i}, \mathbf{V'_i} \right)
:(T,D_h)
\\ \\
\begin{array}{ccccc}
   \mathbf{Q'_i} &  = & \mathbf{Q} & \mathbf{W_i^Q} &:(T,D_h), \\
   & & (T,D_q) & (D_q,D_h) &
   \\ \\
   \mathbf{K'_i} &  = & \mathbf{K} & \mathbf{W_i^K} &:(S,D_h) \\
   & & (S,D_k) & (D_k,D_h) &
   \\ \\
   \mathbf{V'_i} &  = & \mathbf{V} & \mathbf{W_i^V} &:(S,D_h) \\
   & & (S,D_v) & (D_v,D_h) &
   \\
\end{array}
\\ i=1,...,h, \quad D_h \coloneqq \frac{D}{h}
\end{split}
$$

///

In practise we do the matrix multiplication all in one and then split.

$$
\begin{array}{llllll}
\mathbf{W^Q} &= &[\mathbf{W_1^Q}, &...,  &\mathbf{W_h^Q} ] &:(D_q,D)
\\
&&(D_q,D_h) &   &(D_q,D_h) &
\\ \\
\mathbf{QW^Q} &= &[\mathbf{QW_1^Q}, &...,  &\mathbf{QW_h^Q} ] &:(T,D)
\\
&&(T,D_h) &   &(T,D_h) &
\\ \\ \hline \\
\mathbf{W^K} &= &[\mathbf{W_1^K}, &...,  &\mathbf{W_h^K} ] &:(D_k,D)
\\
&&(D_k,D_h) &   &(D_k,D_h) &
\\ \\
\mathbf{KW^K} &= &[\mathbf{KW_1^K}, &...,  &\mathbf{KW_h^K} ] &:(S,D)
\\
&&(S,D_h) &   &(S,D_h) &
\\ \\ \hline \\
\mathbf{W^V} &= &[\mathbf{W_1^V}, &...,  &\mathbf{W_h^V} ] &:(D_v,D)
\\
&&(D_v,D_h) &   &(D_v,D_h) &
\\ \\
\mathbf{VW^V} &= &[\mathbf{VW_1^V}, &...,  &\mathbf{VW_h^V} ] &:(S,D)
\\
&&(S,D_h) &   &(S,D_h) &
\end{array}
$$

The general idea with different heads is for different heads to learn different roles that words can play.

### Attention Visualisation

The diagrams in the paper are show the similarity between words according to $\sigma \left( \frac{\mathbf{QK^T}}{\sqrt{D_k}} \right)$ of each head.
