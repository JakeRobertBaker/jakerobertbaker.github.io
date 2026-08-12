# Chapters 1-3

## Mermaid

### Minimal

```mermaid
flowchart TB

FA["`**Fundamental axiom of analysis**
Every increasing sequence in an ordered field that is bounded above converges to a limit.`"]

SUP["`**Supremum principle**
Every non-empty subset of an ordered field that is bounded above has a supremum.`"]

IVT["`**Intermediate value theorem (IVT)**
If a continuous function on an interval has opposite weak signs at its endpoints, it has a zero in the interval.`"]

MVI["`**Mean value inequality (MVI)**
If *f '(t) ≤ K* throughout an interval, then *f (b) − f (a) ≤ K(b − a)*.`"]

FA -->|"Theorem 3.7<br/>Exercises 3.9 or 3.10"| SUP
SUP -->|Theorem 3.12| IVT
IVT -->|Theorem 1.53| FA

FA -->|"Lemma 1.45<br/>Theorem 1.42"| MVI
MVI -->|Exercise 1.54| FA
```

### Full

```mermaid
flowchart TB

FA["`**Fundamental axiom of analysis**
Every increasing sequence in an ordered field that is bounded above converges to a limit.`"]

IVT["`**Intermediate value theorem (IVT)**
If a continuous function on an interval has opposite weak signs at its endpoints, it has a zero in the interval.`"]

MVI["`**Mean value inequality (MVI)**
If *f '(t) ≤ K* throughout an interval, then *f (b) − f (a) ≤ K(b − a)*.`"]

SUP["`**Supremum principle**
Every non-empty subset of an ordered field that is bounded above has a supremum.`"]


FA -->|Theorem 1.35| IVT
IVT -->|Theorem 1.53| FA

FA -->|"Lemma 1.45<br/>Theorem 1.42"| MVI
MVI -->|Exercise 1.54| FA

FA -->|"Theorem 3.7<br/>Exercise 3.9 or 3.10"| SUP
SUP -->|"Theorem 3.15<br/>direct proof: Exercise 3.16"| FA

SUP -->|Theorem 3.12| IVT
SUP -->|"Lemma 3.14<br/>Theorem 1.42"| MVI
```

## TikZ

Both variants use one ELK Layered layout of the complete graph. The minimal
graph is therefore the full graph with its additional arrows omitted: node,
route, label, and canvas geometry are identical.

### Minimal

![Minimal theorem dependency graph](../../../assets/images/theorem-dependencies/companion-to-analysis-minimal.svg){ .theorem-dependency-graph loading=lazy }

### Full

![Full theorem dependency graph](../../../assets/images/theorem-dependencies/companion-to-analysis-full.svg){ .theorem-dependency-graph loading=lazy }
