# Attention Transformer Details

## Notation

Let $(s,d)$ denote $\mathbb{R}^{s,d}$ and write $\boldsymbol{X} \in \mathbb{R}^{s \times d}$ as
$\boldsymbol{X} : (s,d)$.

Generally $s,t$ refere to sequence lengths and $d$ is the embedding dimension.

## Input Embeddings

The raw text is a sequence of vocabulary terms. Tokenization is the process of splitting the sentence into a sequence of vocabulary terms. Vocab terms can be single words but often tokenizers split the sentences into smaller components than words. In illustrative examples we usually show tokens as words.

/// example | Input Embeddings
    attrs: {id: exm-input_embeds}

$s=5$, $d$ is usually 512 in the traditional paper.

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
\boldsymbol{x_1^T} \\
\boldsymbol{x_2^T} \\
\boldsymbol{x_3^T} \\
\boldsymbol{x_4^T} \\
\boldsymbol{x_5^T}
\end{bmatrix}
\\ \\
\text{Sentence}
&\mapsto
\text{Input IDs}
&&\mapsto
\text{Embedding}:(5,d)
\end{align*}
$$
///

## Positional Encoding

Fixed definition for each position
$p \in \left\{1,...,s \right\}$
and dimension index
$2i \text{ or } 2i+1 \text{ for } i \in \left\{1,...,d \right\}$.

$$
PE :(s,d)  =
\begin{cases}
PE_{p, 2i}     &=&   \sin \left( \dfrac{p}{10,000^{\left(\dfrac{2i}{d}\right)}} \right)
\\
\\
PE_{p, 2i+1}   &=&   \cos \left( \dfrac{p}{10,000^{\left(\dfrac{2i}{d}\right)}} \right)
\end{cases}
$$

### Model Input

Model recieves $X + PE : (s,d)$

## Self Attention

This mechanism is what changed everything.

### Attention Definition

Let Query, Key and Value Matricies be $\boldsymbol{Q}:(t,d_k)$, $\boldsymbol{K}:(s,d_k)$ and $\boldsymbol{V}:(s,d_v)$. We also let $t \in \mathbb{N}$ denote a sequence length not neccessarily equal to $s \in \mathbb{N}$.

/// definition | Attention
    attrs: {id: def-Attention}

$\text{Attention}: (t,d_k) \times (s,d_k) \times (s,d_v) \to (t,d_v)$ maps

$$
\boldsymbol{Q,K,V} \mapsto
\sigma \left( \dfrac{\boldsymbol{Q K^T}}{\sqrt{d_k}} \right) \boldsymbol{V}
: (t,d_v)
$$
for row wise softmax $\sigma$
///

### Explanation

Write the matricies as,

$$
\boldsymbol{Q}=
\begin{bmatrix}
   \boldsymbol{q_1^T}   \\
   \vdots   \\
   \boldsymbol{q_s^T}
\end{bmatrix}
\boldsymbol{K}=
\begin{bmatrix}
   \boldsymbol{k_1^T}   \\
   \vdots   \\
   \boldsymbol{k_s^T}
\end{bmatrix}
\boldsymbol{V}=
\begin{bmatrix}
   \boldsymbol{v_1^T}   \\
   \vdots   \\
   \boldsymbol{v_s^T}
\end{bmatrix}
\text{for }
\boldsymbol{q_i, k_i, v_i} \in \mathbb{R}^{d_v}, i=1,...,s
$$

We see that
$\boldsymbol{Z}_{i,j}\coloneqq \boldsymbol{QK^T}_{i,j} = \boldsymbol{q_i \cdotp k_j}$
is like a similarity score between query $i$ and key $j$.

#### Compatibility Function

If we observe the softmax applied to $\boldsymbol{Z}$, we see that each element is a compatibility function, $\alpha$, between query $i$ and key $j$.

$$
\begin{align*}
\sigma \left( \boldsymbol{Z} \right)_{i,j}
&=
\cfrac{
   \exp \left( \frac{1}{\sqrt{d_k}} \boldsymbol{Z}_{i,j} \right)
   }
   {\sum_{r=1}^s \exp \left( \frac{1}{\sqrt{d_k}} \boldsymbol{Z}_{i,r} \right)
   }
\\
&=
\cfrac{
   \exp \left( \frac{1}{\sqrt{d_k}} \boldsymbol{q_i \cdotp k_j} \right)
   }
   {\sum_{r=1}^s \exp \left( \frac{1}{\sqrt{d_k}} \boldsymbol{q_i \cdotp k_r} \right)
   } =
\cfrac{\text{score}(i,j)}{\sum_{r=1}^s \text{score}(i,r)}
\eqqcolon
\alpha(\boldsymbol{q_i},\boldsymbol{K},j)
\end{align*}
$$

Let
$\boldsymbol{A} \coloneqq \text{Attention}(\boldsymbol{Q,K,V})$, then

$$
\begin{align*}
\boldsymbol{A}_{i,j}
= \sum_{r=1}^s \sigma \left( \boldsymbol{Z} \right)_{i,r}  \boldsymbol{V}_{r,j}
&= \sum_{r=1}^s \alpha(\boldsymbol{q_i},\boldsymbol{K},r) [\boldsymbol{v_r}]_j
\\
\implies
\text{row}_i \left( \boldsymbol{A} \right)
&= \sum_{r=1}^s \alpha(\boldsymbol{q_i},\boldsymbol{K},r) \boldsymbol{v_r^T}
\in \mathbb{R}^{1,d_v}
\end{align*}
$$

row $i$ of $\boldsymbol{A}$ is the sum of values, each weighted by query $i$'s similarity with that key.

### Remarks

/// note | Attention is permutation invariant
    attrs: {id: rem-attention-permutation}

Notice that row $i$ of $\boldsymbol{A}$ is a function of $\boldsymbol{q_i, K,V}$,
$$
\text{row}_i \left( \boldsymbol{A} \right) =
\sum_{r=1}^s \alpha(\boldsymbol{q_i},\boldsymbol{K},r) \boldsymbol{v_r^T}
\eqqcolon f(\boldsymbol{q_i, K,V})
$$

Therefore if we permute two rows of A, the output of Attention has the same two rows permuted.
///

## Muti Head Attention

Let $\boldsymbol{Q}:(t,d_q), \boldsymbol{K}:(s,d_k), \boldsymbol{V}:(s,d_v)$.

/// definition | Multi Head Attention
    attrs: {id: def-MHA}

Given sequence length $s,t \in \mathbb{N}$, dimension lengths $d_q, d_k, d_v, d \in \mathbb{N}$, $h\in \mathbb{N}$ that divides $d$ and parameters $\boldsymbol{W_i^Q, W_i^K, W_i^V}$, for $i=1,...,h$.

$\text{MultiHeadAttention}: (t,d_q) \times (s,d_k) \times (s,d_v) \to (t,d)$ maps

$$
\begin{split}
\boldsymbol{Q,K,V}
 \mapsto
\left[ \boldsymbol{H_1},...,\boldsymbol{H_h} \right]
: (t,d)
\\ \\
\boldsymbol{H_i}
 \coloneqq
\text{Attention} \left( \boldsymbol{Q'_i}, \boldsymbol{K'_i}, \boldsymbol{V'_i} \right)
:(t,d_h)
\\ \\
\begin{array}{ccccc}
   \boldsymbol{Q'_i} &  = & \boldsymbol{Q} & \boldsymbol{W_i^Q} &:(t,d_h), \\
   & & (t,d_q) & (d_q,d_h) &
   \\ \\
   \boldsymbol{K'_i} &  = & \boldsymbol{K} & \boldsymbol{W_i^K} &:(s,d_h) \\
   & & (s,d_k) & (d_k,d_h) &
   \\ \\
   \boldsymbol{V'_i} &  = & \boldsymbol{V} & \boldsymbol{W_i^V} &:(s,d_h) \\
   & & (s,d_v) & (d_v,d_h) &
   \\
\end{array}
\\ i=1,...,h, \quad d_h \coloneqq \frac{d}{h}
\end{split}
$$

///

In practise we do the matrix multiplication all in one and then split.

$$
\begin{array}{llllll}
\boldsymbol{W^Q} &= &[\boldsymbol{W_1^Q}, &...,  &\boldsymbol{W_h^Q} ] &:(d_q,d)
\\
&&(d_q,d_h) &   &(d_q,d_h) &
\\ \\
\boldsymbol{QW^Q} &= &[\boldsymbol{QW_1^Q}, &...,  &\boldsymbol{QW_h^Q} ] &:(t,d)
\\
&&(t,d_h) &   &(t,d_h) &
\\ \\ \hline \\
\boldsymbol{W^K} &= &[\boldsymbol{W_1^K}, &...,  &\boldsymbol{W_h^K} ] &:(d_k,d)
\\
&&(d_k,d_h) &   &(d_k,d_h) &
\\ \\
\boldsymbol{KW^K} &= &[\boldsymbol{KW_1^K}, &...,  &\boldsymbol{KW_h^K} ] &:(s,d)
\\
&&(s,d_h) &   &(s,d_h) &
\\ \\ \hline \\
\boldsymbol{W^V} &= &[\boldsymbol{W_1^V}, &...,  &\boldsymbol{W_h^V} ] &:(d_v,d)
\\
&&(d_v,d_h) &   &(d_v,d_h) &
\\ \\
\boldsymbol{VW^V} &= &[\boldsymbol{VW_1^V}, &...,  &\boldsymbol{VW_h^V} ] &:(s,d)
\\
&&(s,d_h) &   &(s,d_h) &
\end{array}
$$

The general idea with different heads is for different heads to learn different roles that words can play.

### Attention Visualisation

The diagrams in the paper are show the similarity between words according to $\sigma \left( \frac{\boldsymbol{QK^T}}{\sqrt{d_k}} \right)$ of each head.
