// Rainbow brackets for rendered mathematics, by nesting depth. Runs after KaTeX
// and tags each opening/closing delimiter (plain, \left, \big…) `bracket-N`,
// N cycling 0..levels-1; colours live in book.css.
//
// Scope: frontmatter `bracketColors: true | N` for a whole page, or
// `{brackets}` / `{brackets=N}` on a block (src/lib/math-blocks.mjs). N is the
// number of outer nesting levels left uncoloured: bare/true means 1, 0 colours
// everything. The innermost scope wins.
export const levels = 4
const has = (node, name) => node.properties?.className?.includes(name)
const skipOf = (value) => value === true ? 1 : typeof value === "number" || typeof value === "string" ? Number(value) : null

export default function bracketColors() {
  return (tree, file) => {
    const colour = (math, skip) => {
      let depth = 0 // Per formula: an unmatched bracket such as [a, b) cannot leak.
      const walk = (parent) => {
        parent.children = parent.children.flatMap((node) => {
          if (node.type !== "element") return [node]
          const open = has(node, "mopen")
          if (!open && !has(node, "mclose")) { walk(node); return [node] }
          // KaTeX merges adjacent delimiters into one span ("))"); split them.
          const [only] = node.children
          const pieces = node.children.length === 1 && only.type === "text" && only.value.length > 1
            ? [...only.value].map((character) => ({ ...node, children: [{ type: "text", value: character }] }))
            : [node]
          return pieces.map((piece) => {
            if (!open) depth = Math.max(0, depth - 1)
            const className = depth < skip ? piece.properties.className
              : [...piece.properties.className, `bracket-${(depth - skip) % levels}`]
            if (open) depth++
            return { ...piece, properties: { ...piece.properties, className } }
          })
        })
      }
      walk(math)
    }
    const scope = (node, skip) => {
      if (node.properties?.["data-brackets"] !== undefined) skip = skipOf(node.properties["data-brackets"])
      if (has(node, "katex-html")) { if (skip !== null) colour(node, skip); return }
      for (const child of node.children ?? []) if (child.type === "element") scope(child, skip)
    }
    scope(tree, skipOf(file.data.astro?.frontmatter?.bracketColors))
  }
}
