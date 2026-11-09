import { resultKinds } from "./markdown/kinds.mjs"
import { pageUrl, resolveReference } from "./markdown/references.mjs"

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
