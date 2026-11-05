import path from "node:path"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { visit } from "unist-util-visit"
import { toHtml } from "hast-util-to-html"
import { toMarkdown } from "mdast-util-to-markdown"
import { directiveToMarkdown } from "mdast-util-directive"
import { mathToMarkdown } from "mdast-util-math"
import { pageUrl, resolveReference } from "./references.mjs"

const root = fileURLToPath(new URL("../content/docs/", import.meta.url))
export const resultKinds = new Set(["definition", "theorem", "lemma", "proposition", "corollary", "example", "exercise"])
// Referenceable exposition is not automatically a proven result/dependency.
export const expositionKinds = new Set(["remark", "notation"])
// Collapsible arguments: a proof of a result, or a solution to an exercise.
export const proofKinds = new Set(["proof", "solution"])
const numberedKinds = new Set([...resultKinds, ...expositionKinds])
const asides = new Set(["note", "tip", "caution", "danger"])
const serialOptions = { extensions: [directiveToMarkdown(), mathToMarkdown()] }
const serialize = (children) => toMarkdown({ type: "root", children }, serialOptions).trim()
const text = (value) => ({ type: "text", value })
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
const shifted = (position, offset) => position && ({
  start: { ...position.start, line: position.start.line + offset },
  end: { ...position.end, line: position.end.line + offset },
})

function withoutProofs(nodes) {
  return nodes.filter((node) => !(node.type === "containerDirective" && proofKinds.has(node.name)))
    .map((node) => node.children ? { ...node, children: withoutProofs(node.children) } : node)
}

// `books` maps a book ID (used as {book=ID}) to { name, short_name }.
export default function mathBlocks({ books = {} } = {}) {
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
    const labelOf = (node) => node.children[0]?.data?.directiveLabel ? node.children[0] : null
    const kindName = (kind) => kind[0].toUpperCase() + kind.slice(1)
    // Untitled proofs are named after what they prove, so record same-page
    // titles before blocks are rewritten.
    const titles = new Map()
    // Numbers: {n=…} fixes one, optionally from a book ({n=1.2 book=JS});
    // frontmatter `numbering: true` numbers the rest in one page-wide series.
    const numbers = new Map()
    const fixed = new Map()
    visit(tree, "containerDirective", (node) => {
      const { id, n, book } = node.attributes ?? {}
      if (id) titles.set(id, labelOf(node)?.children ?? [text(kindName(node.name))])
      if (!numberedKinds.has(node.name)) return
      if (book !== undefined && n === undefined) fail(`A book result needs its number: {n=1.2 book=${book}}`, node)
      if (book !== undefined && !Object.hasOwn(books, book))
        fail(`Unknown book: ${book} (known: ${Object.keys(books).join(", ") || "none"}; see src/data/books.yaml)`, node)
      if (n === undefined) return
      if (!/^[\w.-]+$/.test(n)) fail(`Invalid number: ${n}`, node)
      const series = fixed.get(book ?? "") ?? fixed.set(book ?? "", new Set()).get(book ?? "")
      if (series.has(n)) fail(`Duplicate number ${n}${book ? ` for book ${book}` : ""}`, node)
      series.add(n)
      numbers.set(node, { number: n, book: book ? { id: book, ...books[book] } : null })
    })
    if (file.data.astro?.frontmatter?.numbering === true) {
      let next = 1
      visit(tree, "containerDirective", (node) => {
        if (!numberedKinds.has(node.name) || numbers.has(node)) return
        while (fixed.get("")?.has(String(next))) next++
        numbers.set(node, { number: String(next++), book: null })
      })
    }
    const labelText = (kind, num) => `${kindName(kind)} ${num.number}`
    const referenceText = (kind, num) => num.book ? `${num.book.short_name} ${num.number}` : labelText(kind, num)
    const targets = new Map()
    visit(tree, "containerDirective", (node) => {
      if (node.attributes?.id) targets.set(node.attributes.id, { kind: node.name, num: numbers.get(node) })
    })
    visit(tree, "containerDirective", (node) => {
      const kind = node.name
      if (!numberedKinds.has(kind) && !proofKinds.has(kind) && !asides.has(kind))
        fail(`Unknown block type: ${kind}`, node)
      const attrs = node.attributes ?? {}
      const num = numbers.get(node)
      const allowed = proofKinds.has(kind) ? ["id", "open", "proves", "uses"]
        : numberedKinds.has(kind) ? ["id", "n", "book"] : ["id"]
      for (const key of Object.keys(attrs))
        if (!allowed.includes(key)) fail(`Unknown ${kind} metadata: ${key}`, node)
      if (attrs.proves !== undefined && !attrs.proves.trim()) fail("proves needs a target", node)
      if (attrs.uses !== undefined && !attrs.proves) fail("uses needs an explicit proves target", node)
      const target = attrs.proves && resolveReference(attrs.proves.trim(), source)
      const targetId = target?.split("#")[1]
      if (target && !targetId) fail(`proves must name a block, e.g. #thm-result: ${attrs.proves}`, node)
      const local = target && (target.startsWith("#") || target.startsWith(`${pageUrl(source)}#`)) ? targetId : null
      // A proof of a result gets a stable default ID; further proofs of the
      // same result choose their own.
      const id = attrs.id ?? (targetId && `${kind}-${targetId}`)
      if (id && !/^[A-Za-z][\w.-]*$/.test(id)) fail(`Invalid block ID: ${id}`, node)
      if (id && ids.has(id)) fail(`Duplicate block ID: ${id}${attrs.id ? "" : ` (give further ${kind}s their own {#id})`}`, node)
      if (id) ids.add(id)
      if (attrs.open !== undefined && !["", "true"].includes(attrs.open))
        fail("Use the boolean {open} attribute for an initially expanded proof", node)
      const label = labelOf(node)
      const name = kindName(kind)
      // Pages render independently, so only same-page targets can name a proof.
      if (target && !label && !local) fail(`A ${kind} of a result on another page needs a title: :::${kind}[${name} of …]{proves="${attrs.proves}"}`, node)
      // Numbered targets are named by number ("Proof of Lemma 3"), others by title.
      const targetBlock = !label && local && targets.get(local)
      const targetTitle = targetBlock && (targetBlock.num ? [text(labelText(targetBlock.kind, targetBlock.num))] : titles.get(local))
      const derived = targetTitle && [text(kind === "solution" ? "Solution to " : "Proof of "), ...structuredClone(targetTitle)]
      const prefix = num ? labelText(kind, num) : name
      const title = derived ? serialize([{ type: "paragraph", children: derived }]) : label ? serialize([label]) : prefix
      const body = label ? node.children.slice(1) : node.children
      if (id) blocks.push({
        id, kind, title, statement: serialize(withoutProofs(body)),
        source, line: (node.position?.start.line ?? 1) + lineOffset,
        label: num ? labelText(kind, num) : null, book: num?.book ?? null,
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
      const titleChildren = derived ? [derived[0], { type: "link", url: `#${local}`, children: derived.slice(1) }]
        : label ? [...label.children] : [text(prefix)]
      // The kind prefix is marked so graphs can show the bare title.
      if (label && (num || (title !== name && !title.toLowerCase().startsWith(`${name.toLowerCase()} `))))
        titleChildren.unshift({ type: "mathKind", data: {
          hName: "span", hProperties: { className: ["math-block__kind"] }, hChildren: [text(`${prefix} · `)],
        } })
      if (num?.book) titleChildren.push({ type: "mathSource", data: {
        hName: "span", hProperties: { className: ["math-block__source"], title: num.book.name },
        hChildren: [text(num.book.short_name)],
      } })
      if (id) titleChildren.push({
        type: "link", url: `#${id}`, children: [text("#")],
        data: { hProperties: { className: ["math-permalink"], "aria-label": `Link to this ${kind}` } },
      })
      Object.assign(node, {
        type: "blockquote",
        data: {
          hName: proofKinds.has(kind) ? "details" : "section",
          hProperties: {
            className: ["math-block", `math-block--${kind}`], "data-math-kind": kind,
            ...(id ? { id } : {}), ...(attrs.open !== undefined ? { open: true } : {}),
          },
        },
        children: [
          { type: "paragraph", children: titleChildren,
            data: { hName: proofKinds.has(kind) ? "summary" : "header", hProperties: { className: ["math-block__title"] } } },
          { type: "blockquote", children: body,
            data: { hName: "div", hProperties: { className: ["math-block__body"] } } },
        ],
      })
    })
    // Same-page references take their text from the target: its number, or
    // its title on unnumbered pages. Other pages render independently.
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
      replaceText(node.data?.hChildren, node.value, value)
      node.value = value
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

// After KaTeX: record each identified block's rendered title and statement, so
// graphs reuse the page's own HTML instead of rendering Markdown a second time.
export function mathBlockHtml() {
  const has = (node, name) => node.properties?.className?.includes(name)
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
  return (tree, file) => {
    const blocks = file.data.astro?.frontmatter?.mathBlocks
    if (!blocks?.length) return
    const page = pageUrl(blocks[0].source)
    const byId = new Map(blocks.map((block) => [block.id, block]))
    visit(tree, "element", (node) => {
      const block = node.properties?.["data-math-kind"] && byId.get(node.properties.id)
      const [title, body] = node.children.filter((child) => child.type === "element")
      if (!block || !has(title, "math-block__title") || !has(body, "math-block__body")) return
      block.titleHtml = toHtml(copy(title.children, (child) => ["math-block__kind", "math-block__source", "math-permalink"].some((name) => has(child, name)), page, false)).trim()
      block.html = toHtml(copy(body.children, (child) => proofKinds.has(child.properties?.["data-math-kind"]), page, true)).trim()
    })
  }
}

// Shared by the site and tests. KaTeX may emit only same-site links, which is
// what \ref/\by expand to; other trusted commands stay disabled.
export const katexOptions = {
  strict: (code) => code === "newLineInDisplayMode" ? "ignore" : "warn",
  trust: ({ command, url }) => command === "\\href" && /^[#/](?!\/)/.test(url),
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
