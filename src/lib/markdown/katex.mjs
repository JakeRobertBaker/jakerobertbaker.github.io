// KaTeX may emit only same-site links, which is what \ref/\by expand to; other
// trusted commands stay disabled.
export const katexOptions = {
  strict: (code) => code === "newLineInDisplayMode" ? "ignore" : "warn",
  trust: ({ command, url }) => command === "\\href" && /^[#/](?!\/)/.test(url),
}

// Astro strips frontmatter before rendering; positions shift back by this.
export const shifted = (position, offset) => position && ({
  start: { ...position.start, line: position.start.line + offset },
  end: { ...position.end, line: position.end.line + offset },
})

export function failMathErrors() {
  return (_tree, file) => {
    const error = file.messages.find((message) => message.source === "rehype-katex")
    if (error) file.fail(error.cause?.message ?? error.message, shifted(error.place, file.data.notesLineOffset ?? 0))
  }
}
