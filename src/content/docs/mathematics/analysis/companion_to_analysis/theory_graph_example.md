---
title: Theory Graph Example
---

:::definition[Even]{#def-even}
$n \in \mathbb{Z}$ is even if $n = 2j$ for some $j \in \mathbb{Z}$.
:::

:::definition[Odd]{#def-odd}
$n \in \mathbb{Z}$ is odd if $n = 2k + 1$ for some $k \in \mathbb{Z}$.
:::

:::theorem[Even plus odd]{#thm-even-plus-odd}
If $m$ is even and $n$ is odd, then $m + n$ is odd.
:::

:::proof[Add the forms]{proves="#thm-even-plus-odd" uses="#def-even #def-odd"}
$m + n = 2j + (2k + 1) = 2(j + k) + 1$.
:::
