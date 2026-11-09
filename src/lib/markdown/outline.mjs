import { visit } from "unist-util-visit"
import { numberedKinds } from "./kinds.mjs"

// Keep the established Python-Markdown heading convention, including _1
// suffixes and source LaTeX (before KaTeX expands it into repeated HTML).
export function assignHeadingIds(tree, blockIds) {
  const taken = new Set(blockIds)
  visit(tree, "html", (node) => {
    for (const match of node.value.matchAll(/\bid=["']([^"']+)["']/g)) taken.add(match[1])
  })
  const plain = (node) => node.value ?? node.children?.map(plain).join("") ?? ""
  visit(tree, "heading", (node) => {
    const base = plain(node).normalize("NFKD").replace(/[^\x00-\x7F]/g, "")
      .toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/[-\s]+/g, "-")
    let id = base
    for (let suffix = 1; taken.has(id); suffix++) id = `${base}_${suffix}`
    taken.add(id)
    node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } }
  })
}

// Optional contents entries: each top-level identified block with the
// headings it sits under (outermost first). Labels are added after KaTeX.
export function collectContents(tree) {
  const contents = []
  const headings = []
  const walk = (node, nested) => {
    if (node.type === "heading") {
      while (headings.length && headings.at(-1).depth >= node.depth) headings.pop()
      headings.push({ depth: node.depth, id: node.data.hProperties.id })
    }
    const { id, "data-math-kind": kind } = node.data?.hProperties ?? {}
    if (kind && id && !nested && numberedKinds.has(kind)) contents.push({ id, kind, sections: headings.map((h) => h.id) })
    for (const child of node.children ?? []) walk(child, nested || Boolean(kind))
  }
  walk(tree, false)
  return contents
}
