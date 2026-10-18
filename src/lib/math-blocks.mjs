import path from "node:path"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { visit } from "unist-util-visit"
import { toMarkdown } from "mdast-util-to-markdown"
import { directiveToMarkdown } from "mdast-util-directive"
import { mathToMarkdown } from "mdast-util-math"
import { pageUrl, resolveReference } from "./references.mjs"

const root = fileURLToPath(new URL("../content/docs/", import.meta.url))
export const resultKinds = new Set(["definition", "theorem", "lemma", "proposition", "corollary", "example"])
// Referenceable exposition is not automatically a proven result/dependency.
export const expositionKinds = new Set(["remark", "notation"])
const asides = new Set(["note", "tip", "caution", "danger"])
const serialOptions = { extensions: [directiveToMarkdown(), mathToMarkdown()] }
const serialize = (children) => toMarkdown({ type: "root", children }, serialOptions).trim()
const text = (value) => ({ type: "text", value })
const shifted = (position, offset) => position && ({
  start: { ...position.start, line: position.start.line + offset },
  end: { ...position.end, line: position.end.line + offset },
})

function withoutProofs(nodes) {
  return nodes.filter((node) => !(node.type === "containerDirective" && node.name === "proof"))
    .map((node) => node.children ? { ...node, children: withoutProofs(node.children) } : node)
}

export default function mathBlocks() {
  return (tree, file) => {
    if (!file.path || !path.resolve(file.path).startsWith(root)) return
    const source = path.relative(root, file.path).split(path.sep).join("/")
    // Astro strips frontmatter before rendering. Recover its line offset from
    // the original body, without reparsing Markdown or caching file contents.
    let lineOffset = 0
    try {
      const original = readFileSync(file.path, "utf8")
      const index = original.indexOf(String(file.value))
      if (index >= 0) lineOffset = original.slice(0, index).match(/\n/g)?.length ?? 0
    } catch (error) { if (error.code !== "ENOENT") throw error }
    file.data.notesLineOffset = lineOffset
    const fail = (message, node) => file.fail(message, shifted(node.position, lineOffset))
    const blocks = []
    const ids = new Set()
    visit(tree, "containerDirective", (node) => {
      const kind = node.name
      if (!resultKinds.has(kind) && !expositionKinds.has(kind) && kind !== "proof" && !asides.has(kind))
        fail(`Unknown block type: ${kind}`, node)
      const attrs = node.attributes ?? {}
      const allowed = kind === "proof" ? ["id", "open", "proves", "uses"] : ["id"]
      for (const key of Object.keys(attrs))
        if (!allowed.includes(key)) fail(`Unknown ${kind} metadata: ${key}`, node)
      const id = attrs.id
      if (id && !/^[A-Za-z][\w.-]*$/.test(id)) fail(`Invalid block ID: ${id}`, node)
      if (id && ids.has(id)) fail(`Duplicate block ID: ${id}`, node)
      if (id) ids.add(id)
      if ((attrs.proves !== undefined || attrs.uses !== undefined) && !id)
        fail("A proof with relationships needs an explicit stable ID", node)
      if (attrs.proves !== undefined && !attrs.proves.trim()) fail("proves needs a target", node)
      if (attrs.uses !== undefined && !attrs.proves) fail("uses needs an explicit proves target", node)
      if (attrs.open !== undefined && !["", "true"].includes(attrs.open))
        fail("Use the boolean {open} attribute for an initially expanded proof", node)
      const label = node.children[0]?.data?.directiveLabel ? node.children[0] : null
      const name = kind[0].toUpperCase() + kind.slice(1)
      const title = label ? serialize([label]) : name
      const body = label ? node.children.slice(1) : node.children
      if (id) blocks.push({
        id, kind, title, statement: serialize(withoutProofs(body)),
        source, line: (node.position?.start.line ?? 1) + lineOffset,
        url: `${pageUrl(source)}#${id}`,
        proves: attrs.proves ?? null,
        uses: attrs.uses?.trim().split(/\s+/).filter(Boolean) ?? [],
      })
      // Preserve Starlight's native aside rendering. Only identified asides need
      // a wrapper because Starlight does not carry directive IDs to its HTML.
      if (asides.has(kind)) {
        if (id) {
          const inner = { ...node, attributes: {} }
          Object.assign(node, {
            type: "blockquote", children: [inner],
            data: { hName: "section", hProperties: { id, "data-math-kind": kind } },
          })
        }
        return
      }
      const titleChildren = label ? [...label.children] : [text(name)]
      if (label && title !== name && !title.toLowerCase().startsWith(`${name.toLowerCase()} `))
        titleChildren.unshift(text(`${name} · `))
      if (id) titleChildren.push({
        type: "link", url: `#${id}`, children: [text("#")],
        data: { hProperties: { className: ["math-permalink"], "aria-label": `Link to this ${kind}` } },
      })
      Object.assign(node, {
        type: "blockquote",
        data: {
          hName: kind === "proof" ? "details" : "section",
          hProperties: {
            className: ["math-block", `math-block--${kind}`], "data-math-kind": kind,
            ...(id ? { id } : {}), ...(attrs.open !== undefined ? { open: true } : {}),
          },
        },
        children: [
          { type: "paragraph", children: titleChildren,
            data: { hName: kind === "proof" ? "summary" : "header", hProperties: { className: ["math-block__title"] } } },
          { type: "blockquote", children: body,
            data: { hName: "div", hProperties: { className: ["math-block__body"] } } },
        ],
      })
    })
    // Keep the established Python-Markdown heading convention, including _1
    // suffixes and source LaTeX (before KaTeX expands it into repeated HTML).
    const headingIds = new Set(ids)
    visit(tree, "html", (node) => {
      for (const match of node.value.matchAll(/\bid=["']([^"']+)["']/g)) headingIds.add(match[1])
    })
    const plain = (node) => node.value ?? node.children?.map(plain).join("") ?? ""
    visit(tree, "heading", (node) => {
      const base = plain(node).normalize("NFKD").replace(/[^\x00-\x7F]/g, "")
        .toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/[-\s]+/g, "-")
      let id = base
      for (let suffix = 1; headingIds.has(id); suffix++) id = `${base}_${suffix}`
      headingIds.add(id)
      node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } }
    })
    visit(tree, (node) => {
      if (["link", "definition", "image"].includes(node.type))
        node.url = resolveReference(node.url, source)
    })
    file.data.astro ??= { frontmatter: {} }
    file.data.astro.frontmatter ??= {}
    file.data.astro.frontmatter.mathBlocks = blocks
  }
}

export function failMathErrors() {
  return (_tree, file) => {
    const error = file.messages.find((message) => message.source === "rehype-katex")
    if (error) file.fail(error.cause?.message ?? error.message, shifted(error.place, file.data.notesLineOffset ?? 0))
  }
}

// Pure aggregation: no mutable plugin singleton or competing Markdown parser.
// The endpoint reads fresh per-page metadata from Astro's own render pipeline.
export function createRegistry(pages) {
  const blocks = pages.flatMap((page) => page.blocks.map((block) => ({ ...block, uses: [...block.uses] })))
  const targets = new Map()
  for (const block of blocks) {
    if (targets.has(block.url)) throw new Error(`Duplicate result: ${block.url}`)
    targets.set(block.url, block)
  }
  for (const block of blocks) {
    const locate = (reference) => {
      const resolved = resolveReference(reference, block.source)
      const url = new URL(resolved, `https://notes.invalid${pageUrl(block.source)}`)
      if (url.origin !== "https://notes.invalid" || url.search || !url.hash)
        throw new Error(`${block.source}:${block.line}: dependency must identify a local block: ${reference}`)
      const target = targets.get(`${url.pathname}${url.hash}`)
      if (!target) throw new Error(`${block.source}:${block.line}: unknown dependency ${reference}`)
      if (!resultKinds.has(target.kind)) throw new Error(`${block.source}:${block.line}: dependency is not a result: ${reference}`)
      if (target.url === block.url) throw new Error(`${block.source}:${block.line}: self dependency`)
      return target.url
    }
    block.proves = block.proves ? locate(block.proves) : null
    block.uses = [...new Set(block.uses.map(locate))]
  }
  return { version: 1, blocks: blocks.sort((a, b) => a.url.localeCompare(b.url)) }
}
