import path from "node:path"
import { visit } from "unist-util-visit"
import { labelText, text } from "./kinds.mjs"

export function pageUrl(source) {
  const slug = source.replace(/\.(md|mdx)$/, "").replace(/(^|\/)index$/, "")
  return `/${slug.replace(/\/$/, "")}${slug ? "/" : ""}`
}

// Source-relative Markdown references and assets share this resolver. Canonical
// root-relative URLs, fragments, queries, and external URLs are left intact.
export function resolveReference(reference, source) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/|#|\?)/i.test(reference)) return reference
  const [, pathname, suffix = ""] = reference.match(/^([^?#]*)(.*)$/)
  const destination = path.posix.normalize(path.posix.join(path.posix.dirname(source), pathname))
  if (destination === ".." || destination.startsWith("../"))
    throw new Error(`Reference escapes the content root: ${reference} in ${source}`)
  return (/\.(md|mdx)$/.test(destination) ? pageUrl(destination) : `/${destination}`) + suffix
}

// Plain text of a title, or null if it contains math (which \text{} cannot show).
const plainText = (nodes) => {
  let value = ""
  for (const node of nodes) {
    const part = node.type === "inlineMath" ? null : node.value ?? plainText(node.children ?? [])
    if (part === null) return null
    value += part
  }
  return value
}
// Escape text placed in a KaTeX \text{...} argument.
const texText = (value) => value.replace(/[\\{}$&#%_^~]/g, (c) =>
  ({ "\\": "\\textbackslash{}", "^": "\\textasciicircum{}", "~": "\\textasciitilde{}" })[c] ?? `\\${c}`)
// \ref{id}, \by{id} and their [text] overrides inside $...$ / $$...$$.
const mathReference = /\\(by|ref)(?:\[([^\]]*)\])?\{([^{}]*)\}/g
const replaceText = (nodes, from, to) => nodes?.forEach((node) => {
  if (node.type === "text" && node.value === from) node.value = to
  replaceText(node.children, from, to)
})

// Same-page references take their text from the target: its number, or its
// title on unnumbered pages. Other pages render independently.
export function resolveBlockReferences(tree, { source, fail }, { targets, titles }) {
  const referenceText = (kind, num) => num.book ? `${num.book.short_name} ${num.number}` : labelText(kind, num)
  const lookup = (reference, node, form) => {
    const url = resolveReference(reference.includes("#") ? reference : `#${reference}`, source)
    const [page, id] = url.split("#")
    if (page && page !== pageUrl(source)) return { url, text: null, external: true }
    const target = targets.get(id)
    if (!target) fail(`${form}: no block with ID ${id} on this page`, node)
    return { url: `#${id}`, text: target.num ? referenceText(target.kind, target.num) : null, title: titles.get(id) }
  }
  visit(tree, "link", (node) => {
    if (node.children.length || !node.url.includes("#")) return
    const target = lookup(node.url, node, `[](${node.url})`)
    if (target.external) fail(`A link to another page needs text: [text](${node.url})`, node)
    node.children = target.text ? [text(target.text)] : structuredClone(target.title)
  })
  visit(tree, (node) => node.type === "math" || node.type === "inlineMath", (node) => {
    const value = node.value.replace(mathReference, (form, command, override, reference) => {
      const target = lookup(reference.trim(), node, form)
      const label = override ?? target.text ?? (target.title && plainText(target.title))
      if (label == null) fail(`${form} needs its text: \\${command}[Text]{${reference}}`, node)
      return command === "by" ? `\\text{[\\href{${target.url}}{${texText(label)}}]}`
        : `\\href{${target.url}}{\\text{${texText(label)}}}`
    })
    if (value === node.value) return
    // remark-math also stores the TeX in node.data.hChildren, which is what
    // rehype-katex reads; keep both copies in step.
    replaceText(node.data?.hChildren, node.value, value)
    node.value = value
  })
}

export function resolveUrls(tree, source) {
  visit(tree, (node) => {
    if (["link", "definition", "image"].includes(node.type))
      node.url = resolveReference(node.url, source)
  })
}
