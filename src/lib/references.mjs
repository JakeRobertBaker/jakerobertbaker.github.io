import path from "node:path"

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
