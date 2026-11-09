import { visit } from "unist-util-visit"
import { kindName, labelOf, numberedKinds, text } from "./kinds.mjs"

// First pass, before blocks are rewritten: number blocks and index every
// identified one, so proofs and references can name later targets.
//
// {n=…} fixes a number, optionally from a book ({n=1.2 book=JS}); frontmatter
// `numbering: true` numbers the rest in one page-wide series.
export function indexBlocks(tree, file, fail, books) {
  // Untitled proofs are named after what they prove, hence the titles.
  const titles = new Map()
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
    const key = book ?? ""
    if (!fixed.has(key)) fixed.set(key, new Set())
    const series = fixed.get(key)
    if (series.has(n)) fail(`Duplicate number ${n}${book ? ` for book ${book}` : ""}`, node)
    series.add(n)
    numbers.set(node, { number: n, book: book ? { id: book, ...books[book] } : null })
  })
  // Auto-number after all fixed numbers are known, so the series can skip them.
  const autoNumber = file.data.astro?.frontmatter?.numbering === true
  const targets = new Map()
  let next = 1
  visit(tree, "containerDirective", (node) => {
    if (autoNumber && numberedKinds.has(node.name) && !numbers.has(node)) {
      while (fixed.get("")?.has(String(next))) next++
      numbers.set(node, { number: String(next++), book: null })
    }
    if (node.attributes?.id) targets.set(node.attributes.id, { kind: node.name, num: numbers.get(node) })
  })
  return { numbers, targets, titles }
}
