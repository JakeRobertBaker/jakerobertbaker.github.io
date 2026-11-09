import { visit } from "unist-util-visit"
import { toHtml } from "hast-util-to-html"
import { presentationText } from "./heading-labels.mjs"
import { proofKinds } from "./kinds.mjs"
import { pageUrl } from "./references.mjs"

const has = (node, name) => node.properties?.className?.includes(name)
const hasAny = (node, names) => names.some((name) => has(node, name))

// Copies drop IDs and qualify fragment links, so they work on other pages.
// Titles also lose links, as they are shown inside other links or buttons.
const copy = (nodes, skip, page, links) => nodes.filter((node) => !skip(node)).flatMap((node) => {
  if (node.type !== "element") return [node]
  const children = copy(node.children, skip, page, links)
  if (node.tagName === "a" && !links) return children
  const { id: _, ...properties } = node.properties
  if (typeof properties.href === "string" && properties.href.startsWith("#")) properties.href = page + properties.href
  return [{ ...node, properties, children }]
})

// After KaTeX: record each identified block's rendered title and statement, so
// graphs reuse the page's own HTML instead of rendering Markdown a second time.
export function mathBlockHtml() {
  return (tree, file) => {
    const blocks = file.data.astro?.frontmatter?.mathBlocks
    if (!blocks?.length) return
    const contents = new Map(file.data.astro.frontmatter.mathContents?.map((entry) => [entry.id, entry]))
    const page = pageUrl(blocks[0].source)
    const byId = new Map(blocks.map((block) => [block.id, block]))
    visit(tree, "element", (node) => {
      const block = node.properties?.["data-math-kind"] && byId.get(node.properties.id)
      const [title, body] = node.children.filter((child) => child.type === "element")
      if (!block || !has(title, "math-block__title") || !has(body, "math-block__body")) return
      const entry = contents.get(block.id)
      if (entry) entry.text = presentationText({ children: title.children.filter((child) => !hasAny(child, ["math-block__source", "math-permalink"])) })
      block.titleHtml = toHtml(copy(title.children, (child) => hasAny(child, ["math-block__kind", "math-block__source", "math-permalink"]), page, false)).trim()
      block.html = toHtml(copy(body.children, (child) => proofKinds.has(child.properties?.["data-math-kind"]), page, true)).trim()
    })
  }
}
