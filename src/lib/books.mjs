import { readFileSync } from "node:fs"
import { parse } from "yaml"

// The one place books are read and checked; math-blocks receives the result.
export function loadBooks(url) {
  const books = parse(readFileSync(url, "utf8")) ?? {}
  for (const [id, book] of Object.entries(books)) {
    if (!/^[A-Za-z][\w-]*$/.test(id)) throw new Error(`${url}: invalid book ID ${id}`)
    for (const key of ["name", "short_name"])
      if (typeof book?.[key] !== "string" || !book[key].trim()) throw new Error(`${url}: book ${id} needs a ${key}`)
    for (const key of Object.keys(book))
      if (!["name", "short_name"].includes(key)) throw new Error(`${url}: book ${id} has unknown field ${key}`)
  }
  return books
}
