import { visit } from "unist-util-visit"
import { asides, kindName, labelOf, labelText, numberedKinds, proofKinds, text } from "./kinds.mjs"
import { listDirective } from "./list-styles.mjs"
import { pageUrl, resolveReference } from "./references.mjs"

// A title as registry text: inline Markdown flattened, math kept as $…$.
const sourceText = (nodes) => nodes.map((node) =>
  node.type === "inlineMath" ? `$${node.value}$` : node.value ?? sourceText(node.children ?? [])).join("")

// Validate each block's metadata and rewrite it to semantic HTML. Returns the
// registry records and the set of block IDs on the page.
export function rewriteBlocks(tree, { source, fail, lineOffset }, { numbers, targets, titles }) {
  const blocks = []
  const ids = new Set()
  visit(tree, "containerDirective", (node) => {
    const kind = node.name
    if (kind === listDirective) return
    if (!numberedKinds.has(kind) && !proofKinds.has(kind) && !asides.has(kind))
      fail(`Unknown block type: ${kind}`, node)
    const attrs = node.attributes ?? {}
    const num = numbers.get(node)
    const allowed = proofKinds.has(kind) ? ["id", "open", "proves", "uses", "brackets"]
      : numberedKinds.has(kind) ? ["id", "n", "book", "brackets"] : ["id"]
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
    if (attrs.brackets !== undefined && !/^\d*$/.test(attrs.brackets))
      fail("brackets is the number of outer levels left uncoloured: {brackets} or {brackets=2}", node)
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
    const title = derived ? sourceText(derived) : label ? sourceText(label.children) : prefix
    const body = label ? node.children.slice(1) : node.children
    if (id) blocks.push({
      id, kind, title,
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
          ...(id ? { id } : {}), ...(attrs.brackets !== undefined ? { "data-brackets": attrs.brackets || "1" } : {}),
          ...(attrs.open !== undefined ? { open: true } : {}),
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
  return { blocks, ids }
}
