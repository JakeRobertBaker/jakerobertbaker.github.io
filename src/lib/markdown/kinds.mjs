// Block vocabulary shared by the Markdown plugins, content schema and graphs.
export const resultKinds = new Set(["definition", "theorem", "lemma", "proposition", "corollary", "example", "exercise"])
// Referenceable exposition is not automatically a proven result/dependency.
export const expositionKinds = new Set(["remark", "notation"])
// Collapsible arguments: a proof of a result, or a solution to an exercise.
export const proofKinds = new Set(["proof", "solution"])
export const numberedKinds = new Set([...resultKinds, ...expositionKinds])
export const asides = new Set(["note", "tip", "caution", "danger"])

export const kindName = (kind) => kind[0].toUpperCase() + kind.slice(1)
export const labelText = (kind, num) => `${kindName(kind)} ${num.number}`
export const text = (value) => ({ type: "text", value })
export const labelOf = (node) => node.children[0]?.data?.directiveLabel ? node.children[0] : null
