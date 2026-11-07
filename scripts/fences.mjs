// Directive fence normaliser. Authors write `:::name … :::` everywhere; fence length is derived
// (3 + nesting height) so an outer block is always longer than the blocks inside it, as
// remark-directive requires. A named fence opens, a bare one closes.
//
//   node scripts/fences.mjs [--fix] [paths…]   check (default) or rewrite; default path src/content
//   node scripts/fences.mjs --stdin            fixed text from stdin to stdout (editor formatters)
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { pathToFileURL } from "node:url"

const BASE = 3
const FENCE = /^(\s*)(:{3,})(\s*[A-Za-z].*|\s*)$/
const CODE = /^\s*(`{3,}|~{3,})/

/** Returns { text, problems } with every container fence set to its derived length. */
export function normalizeFences(text) {
  const lines = text.split("\n")
  const problems = []
  const root = { height: 0, opener: -1, closer: -1 }
  const stack = [root]
  let code = null
  let math = false

  lines.forEach((line, n) => {
    const fence = line.match(CODE)?.[1]
    if (code) return void (fence?.[0] === code[0] && fence.length >= code.length && (code = null))
    if (fence) return void (code = fence)
    if (line.split("$$").length % 2 === 0) math = !math
    if (math) return
    const match = line.match(FENCE)
    if (!match) return
    if (match[3].trim()) {
      stack.push({ height: 0, opener: n, closer: -1 })
    } else if (stack.length > 1) {
      const block = stack.pop()
      block.closer = n
      const parent = stack.at(-1)
      parent.height = Math.max(parent.height, block.height + 1)
      lines[block.opener] = lines[block.opener].replace(/:+/, ":".repeat(BASE + block.height))
      lines[n] = lines[n].replace(/:+/, ":".repeat(BASE + block.height))
    } else {
      problems.push({ line: n + 1, message: "closing fence without an opening block" })
    }
  })
  for (const block of stack.slice(1)) problems.push({ line: block.opener + 1, message: "block is never closed" })
  return { text: lines.join("\n"), problems }
}

function* markdownFiles(path) {
  if (statSync(path).isFile()) return yield path
  for (const entry of readdirSync(path, { recursive: true })) if (/\.mdx?$/.test(entry)) yield join(path, entry)
}

function main(args) {
  const fix = args.includes("--fix")
  const paths = args.filter((arg) => !arg.startsWith("--"))
  if (args.includes("--stdin")) {
    const { text, problems } = normalizeFences(readFileSync(0, "utf8"))
    for (const { line, message } of problems) console.error(`stdin:${line}: ${message}`)
    process.stdout.write(text)
    return problems.length ? 1 : 0
  }
  let failures = 0
  for (const root of paths.length ? paths : ["src/content"]) {
    for (const file of markdownFiles(root)) {
      const source = readFileSync(file, "utf8")
      const { text, problems } = normalizeFences(source)
      for (const { line, message } of problems) console.error(`${file}:${line}: ${message}`)
      if (problems.length) failures++
      else if (text !== source) {
        if (fix) writeFileSync(file, text)
        else (console.error(`${file}: fence lengths are not normalised (run npm run fences:fix)`), failures++)
      }
    }
  }
  return failures ? 1 : 0
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = main(process.argv.slice(2))
