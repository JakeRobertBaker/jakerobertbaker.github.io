import path from "node:path"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import rehypeKatex from "rehype-katex"
import remarkDirective from "remark-directive"
import remarkMath from "remark-math"
import { mathBlockHtml } from "./block-html.mjs"
import { rewriteBlocks } from "./blocks.mjs"
import bracketColors from "./bracket-colors.mjs"
import headingLabels from "./heading-labels.mjs"
import { failMathErrors, katexOptions, shifted } from "./katex.mjs"
import listStyles from "./list-styles.mjs"
import { indexBlocks } from "./numbering.mjs"
import { assignHeadingIds, collectContents } from "./outline.mjs"
import { resolveBlockReferences, resolveUrls } from "./references.mjs"

const root = fileURLToPath(new URL("../../content/docs/", import.meta.url))

// Astro strips frontmatter before rendering. Recover its line offset from the
// original body, without reparsing Markdown or caching file contents.
function frontmatterLines(file) {
  try {
    const original = readFileSync(file.path, "utf8")
    const index = original.indexOf(String(file.value))
    return index >= 0 ? original.slice(0, index).match(/\n/g)?.length ?? 0 : 0
  } catch (error) {
    if (error.code !== "ENOENT") throw error
    return 0
  }
}

// `books` maps a book ID (used as {book=ID}) to { name, short_name }.
function mathBlocks({ books = {} } = {}) {
  return (tree, file) => {
    if (!file.path || !path.resolve(file.path).startsWith(root)) return
    const source = path.relative(root, file.path).split(path.sep).join("/")
    const lineOffset = frontmatterLines(file)
    file.data.notesLineOffset = lineOffset
    const fail = (message, node) => file.fail(message, shifted(node.position, lineOffset))
    const page = { source, fail, lineOffset }

    const index = indexBlocks(tree, file, fail, books)
    const { blocks, ids } = rewriteBlocks(tree, page, index)
    resolveBlockReferences(tree, page, index)
    assignHeadingIds(tree, ids)
    const contents = collectContents(tree)
    resolveUrls(tree, source)

    file.data.astro ??= { frontmatter: {} }
    file.data.astro.frontmatter ??= {}
    file.data.astro.frontmatter.mathBlocks = blocks
    file.data.astro.frontmatter.mathContents = contents
  }
}

// The whole pipeline, in its required order; shared by the site and tests.
export function notesMarkdown({ books } = {}) {
  return {
    remarkPlugins: [remarkMath, remarkDirective, listStyles, [mathBlocks, { books }]],
    rehypePlugins: [[rehypeKatex, katexOptions], failMathErrors, bracketColors, mathBlockHtml, headingLabels],
  }
}
