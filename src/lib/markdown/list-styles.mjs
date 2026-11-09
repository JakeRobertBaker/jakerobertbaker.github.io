import { visit } from "unist-util-visit"

// `:::list{style="(a) (i)"}` sets the marker of each nesting level of the
// ordered lists it wraps. Markdown keeps writing `1.`; CSS draws the labels
// (counter styles live in notes.css).
export const listDirective = "list"
const markers = {
  "1.": "decimal", "(1)": "paren-decimal",
  "a.": "lower-alpha", "(a)": "paren-lower-alpha",
  "A.": "upper-alpha", "(A)": "paren-upper-alpha",
  "i.": "lower-roman", "(i)": "paren-lower-roman",
  "I.": "upper-roman", "(I)": "paren-upper-roman",
}
const maxDepth = 3

export default function listStyles() {
  return (tree, file) => {
    visit(tree, "containerDirective", (node) => {
      if (node.name !== listDirective) return
      const fail = (message) => file.fail(message, node.position)
      const { style, ...rest } = node.attributes ?? {}
      for (const key of Object.keys(rest)) fail(`Unknown list metadata: ${key}`)
      const levels = style?.trim().split(/\s+/).filter(Boolean) ?? []
      if (!levels.length || levels.length > maxDepth)
        fail(`list needs 1–${maxDepth} marker styles, e.g. :::list{style="(a) (i)"}`)
      const unknown = levels.find((marker) => !markers[marker])
      if (unknown) fail(`Unknown list marker "${unknown}"; use one of ${Object.keys(markers).join(" ")}`)
      node.data = {
        hName: "div",
        hProperties: {
          className: ["list-styles"],
          style: levels.map((marker, i) => `--list-${i + 1}: ${markers[marker]}`).join("; "),
        },
      }
    })
  }
}
