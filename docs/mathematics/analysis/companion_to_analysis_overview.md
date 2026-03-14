# Key Definitions — Körner, *A Companion to Analysis* (CTA)

Some summaries for my revision.

**Source:** T. W. Körner, *A Companion to Analysis* (AMS Graduate Studies in Mathematics, Vol. 62). Chapters 1–6.

---

## Chapter 1 — The Real Line

/// definition | Limit of a Sequence
    attrs: {id: def-cta-limit}

(CTA, Definition 1.5) We say $a_n \to a$ as $n \to \infty$ if, given any $\varepsilon > 0$, we can find an integer $n_0(\varepsilon)$ such that $|a_n - a| < \varepsilon$ for all $n \geq n_0(\varepsilon)$.

///

/// definition | Continuity
    attrs: {id: def-cta-continuity}

(CTA, Definition 1.12) Suppose $E \subseteq \mathbb{F}$ (an ordered field) and $f : E \to \mathbb{F}$. We say $f$ is *continuous* at $x \in E$ if, given any $\varepsilon > 0$, we can find $\delta_0(\varepsilon, x) > 0$ such that $|f(x) - f(y)| < \varepsilon$ for all $y \in E$ with $|x - y| < \delta_0(\varepsilon, x)$.

///

/// definition | Divergence to Infinity
    attrs: {id: def-cta-diverge}

(CTA, Definition 1.27) We say $a_n \to \infty$ as $n \to \infty$ if, given any real $K$, we can find an $n_0(K)$ such that $a_n > K$ for all $n \geq n_0(K)$.

///

/// definition | Derivative (One-Dimensional)
    attrs: {id: def-cta-derivative-1d}

(CTA, Definition 1.43) Let $U$ be an open set in $\mathbb{R}$. We say $f : U \to \mathbb{R}$ is *differentiable* at $t \in U$ with derivative $f'(t)$ if, given $\varepsilon > 0$, we can find $\delta(t, \varepsilon) > 0$ such that $(t - \delta, t + \delta) \subseteq U$ and
$$
\left| \frac{f(t+h) - f(t)}{h} - f'(t) \right| < \varepsilon
$$
whenever $0 < |h| < \delta(t, \varepsilon)$.

///

**The Fundamental Axiom:** (CTA, §1.4) Every increasing sequence of reals bounded above tends to a limit. This is the foundational property distinguishing $\mathbb{R}$ from $\mathbb{Q}$, and all of analysis depends on it.

/// theorem | Intermediate Value Theorem
    attrs: {id: thm-cta-ivt}

(CTA, Theorem 1.35) If $f : [a, b] \to \mathbb{R}$ is continuous and $f(a) > 0 > f(b)$, then there exists $c \in [a, b]$ such that $f(c) = 0$.

///

/// theorem | Mean Value Inequality
    attrs: {id: thm-cta-mvi}

(CTA, Theorem 1.42) Let $U = (\alpha, \beta)$. If $f : U \to \mathbb{R}$ is differentiable with $f'(t) \leq K$ for all $t \in U$, and $a, b \in U$ with $b > a$, then $f(b) - f(a) \leq (b - a)K$.

///

/// theorem | Constant Value Theorem
    attrs: {id: thm-cta-cvt}

(CTA, Theorem 1.46) If $f : U \to \mathbb{R}$ is differentiable with $f'(t) = 0$ for all $t \in U$ (where $U$ is an open interval or $\mathbb{R}$), then $f$ is constant.

///

---

## Chapter 3 — Other Versions of the Fundamental Axiom

/// definition | Supremum (Least Upper Bound)
    attrs: {id: def-cta-supremum}

(CTA, Definition 3.3) For a non-empty set $A \subseteq \mathbb{R}$, $\alpha$ is a *least upper bound* (supremum) for $A$ if: (i) $\alpha \geq a$ for all $a \in A$; (ii) if $\beta \geq a$ for all $a \in A$, then $\beta \geq \alpha$.

///

/// theorem | Supremum Principle
    attrs: {id: thm-cta-supremum}

(CTA, Theorem 3.7) Every non-empty set of real numbers bounded above has a supremum.

///

/// theorem | Bolzano–Weierstrass Theorem
    attrs: {id: thm-cta-bw}

(CTA, Theorem 3.17) If $x_n \in \mathbb{R}$ and there exists $K$ with $|x_n| \leq K$ for all $n$, then we can find $n(1) < n(2) < \cdots$ and $x \in \mathbb{R}$ such that $x_{n(j)} \to x$ as $j \to \infty$.

///

/// definition | lim sup
    attrs: {id: def-cta-limsup}

(CTA, Definition 3.23) If $x_n$ is a sequence bounded above,
$$
\limsup_{n \to \infty} x_n = \lim_{n \to \infty} \sup\{x_m : m \geq n\}.
$$

///

---

## Chapter 4 — Higher Dimensions

/// definition | Norm and Inner Product on $\mathbb{R}^m$
    attrs: {id: def-cta-norm}

(CTA, §4.1) For $\mathbf{x} \in \mathbb{R}^m$, the *Euclidean norm* is $\|\mathbf{x}\| = (\mathbf{x} \cdot \mathbf{x})^{1/2}$, where $\mathbf{x} \cdot \mathbf{y} = \sum_{j=1}^m x_j y_j$.

///

/// theorem | Cauchy–Schwarz Inequality
    attrs: {id: thm-cta-cs}

(CTA, Lemma 4.2) For $\mathbf{x}, \mathbf{y} \in \mathbb{R}^m$, $|\mathbf{x} \cdot \mathbf{y}| \leq \|\mathbf{x}\|\|\mathbf{y}\|$.

///

/// definition | Closed Set in $\mathbb{R}^m$
    attrs: {id: def-cta-closed}

(CTA, Definition 4.15) A set $F \subseteq \mathbb{R}^m$ is *closed* if whenever $\mathbf{x}_n \in F$ for each $n$ and $\mathbf{x}_n \to \mathbf{x}$ as $n \to \infty$, then $\mathbf{x} \in F$.

///

/// definition | Open Set in $\mathbb{R}^m$
    attrs: {id: def-cta-open}

(CTA, Definition 4.18) A set $U \subseteq \mathbb{R}^m$ is *open* if, whenever $\mathbf{x} \in U$, there exists $\varepsilon > 0$ such that $\|\mathbf{x} - \mathbf{y}\| < \varepsilon$ implies $\mathbf{y} \in U$.

///

/// definition | Continuity in $\mathbb{R}^m$
    attrs: {id: def-cta-continuity-rm}

(CTA, Definition 4.28) $f : E \to \mathbb{R}^p$ (where $E \subseteq \mathbb{R}^m$) is *continuous* at $\mathbf{x} \in E$ if, given $\varepsilon > 0$, there exists $\delta(\varepsilon, \mathbf{x}) > 0$ such that $\|\mathbf{x} - \mathbf{y}\| < \delta$ implies $\|f(\mathbf{x}) - f(\mathbf{y})\| < \varepsilon$.

///

/// theorem | Bolzano–Weierstrass in $\mathbb{R}^m$
    attrs: {id: thm-cta-bw-rm}

(CTA, Theorem 4.12) If $\mathbf{x}_n \in \mathbb{R}^m$ and $\|\mathbf{x}_n\| \leq K$ for all $n$, then there exist $n(1) < n(2) < \cdots$ and $\mathbf{x} \in \mathbb{R}^m$ such that $\mathbf{x}_{n(j)} \to \mathbf{x}$ as $j \to \infty$.

///

/// theorem | Continuous Image of Closed Bounded Set
    attrs: {id: thm-cta-compact-image}

(CTA, Theorem 4.41) If $K$ is a closed bounded subset of $\mathbb{R}^m$ and $f : K \to \mathbb{R}^p$ is continuous, then $f(K)$ is closed and bounded.

///

/// theorem | Extreme Value Theorem
    attrs: {id: thm-cta-evt}

(CTA, Theorem 4.44) If $K$ is a closed bounded subset of $\mathbb{R}^m$ and $f : K \to \mathbb{R}$ is continuous, then there exist $\mathbf{k}_1, \mathbf{k}_2 \in K$ such that $f(\mathbf{k}_2) \leq f(\mathbf{k}) \leq f(\mathbf{k}_1)$ for all $\mathbf{k} \in K$.

///

/// theorem | Mean Value Theorem
    attrs: {id: thm-cta-mvt}

(CTA, Theorem 4.49) If $f : [a,b] \to \mathbb{R}$ is continuous with $f$ differentiable on $(a,b)$, then there exists $c \in (a,b)$ such that $f(b) - f(a) = (b-a)f'(c)$.

///

/// theorem | Rolle's Theorem
    attrs: {id: thm-cta-rolle}

(CTA, Theorem 4.52) If $g : [a,b] \to \mathbb{R}$ is continuous, differentiable on $(a,b)$, and $g(a) = g(b)$, then there exists $c \in (a,b)$ such that $g'(c) = 0$.

///

/// definition | Uniform Continuity
    attrs: {id: def-cta-uniform-continuity}

(CTA, Definition 4.60) $f : E \to \mathbb{R}^p$ is *uniformly continuous* on $E \subseteq \mathbb{R}^m$ if, given $\varepsilon > 0$, there exists $\delta(\varepsilon) > 0$ such that $\|\mathbf{x} - \mathbf{y}\| < \delta$ implies $\|f(\mathbf{x}) - f(\mathbf{y})\| < \varepsilon$ for all $\mathbf{x}, \mathbf{y} \in E$.

///

/// theorem | Uniform Continuity on Closed Bounded Sets
    attrs: {id: thm-cta-unif-cont}

(CTA, Theorem 4.63) If $K$ is a closed bounded subset of $\mathbb{R}^m$ and $f : K \to \mathbb{R}^p$ is continuous, then $f$ is uniformly continuous on $K$.

///

/// definition | Cauchy Sequence
    attrs: {id: def-cta-cauchy}

(CTA, Definition 4.66) A sequence $\mathbf{x}_n \in \mathbb{R}^m$ is a *Cauchy sequence* if, given $\varepsilon > 0$, there exists $n_0(\varepsilon)$ such that $\|\mathbf{x}_p - \mathbf{x}_q\| < \varepsilon$ for all $p, q \geq n_0(\varepsilon)$.

///

/// theorem | General Principle of Convergence
    attrs: {id: thm-cta-cauchy}

(CTA, Theorem 4.70) A sequence in $\mathbb{R}^m$ converges if and only if it is a Cauchy sequence.

///

---

## Chapter 6 — Differentiation

/// definition | Differentiability in $\mathbb{R}^m$
    attrs: {id: def-cta-diff-rm}

(CTA, Definition 6.4) Let $E \subseteq \mathbb{R}^m$ with $B(\mathbf{x}, \delta) \subseteq E$ for some $\delta > 0$. We say $f : E \to \mathbb{R}^p$ is *differentiable* at $\mathbf{x}$ if there exists a linear map $\alpha : \mathbb{R}^m \to \mathbb{R}^p$ such that

$$
f(\mathbf{x} + \mathbf{h}) = f(\mathbf{x}) + \alpha\mathbf{h} + \varepsilon(\mathbf{x}, \mathbf{h})\|\mathbf{h}\|
$$
where $\|\varepsilon(\mathbf{x}, \mathbf{h})\| \to 0$ as $\|\mathbf{h}\| \to 0$. We write $\alpha = Df(\mathbf{x})$.

///

/// definition | Operator Norm
    attrs: {id: def-cta-op-norm}

(CTA, Definition 6.13) If $\alpha : \mathbb{R}^m \to \mathbb{R}^p$ is a linear map, then $\|\alpha\| = \sup_{\|\mathbf{x}\| \leq 1} \|\alpha\mathbf{x}\|$.

///

/// theorem | Chain Rule
    attrs: {id: thm-cta-chain-rule}

(CTA, Lemma 6.19) Let $f : U \to V$ be differentiable at $\mathbf{x}$ with derivative $\alpha$, and $g : V \to \mathbb{R}^q$ differentiable at $\mathbf{y} = f(\mathbf{x})$ with derivative $\beta$. Then $g \circ f$ is differentiable at $\mathbf{x}$ with derivative $\beta\alpha$, i.e., $D(g \circ f)(\mathbf{x}) = Dg(f(\mathbf{x})) \cdot Df(\mathbf{x})$.

///

/// theorem | Mean Value Inequality (Higher Dimensions)
    attrs: {id: thm-cta-mvi-rm}

(CTA, Theorem 6.27) If $f : U \to \mathbb{R}^p$ is differentiable on an open set $U \subseteq \mathbb{R}^m$, and the line segment $L$ joining $\mathbf{a}$ to $\mathbf{b}$ lies entirely in $U$ with $\|Df(\mathbf{x})\| \leq K$ for all $\mathbf{x} \in L$, then $\|f(\mathbf{a}) - f(\mathbf{b})\| \leq K\|\mathbf{a} - \mathbf{b}\|$.

///
