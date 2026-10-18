import { visit } from 'unist-util-visit';

// Astro collects all heading text after KaTeX, including its MathML annotation
// and duplicate visual HTML. Supply plain navigation labels from the MathML
// presentation once, without modifying the heading, its ID or rendered maths.
export default function headingLabels() {
  return (tree, file) => {
    const labels = {};
    const plain = (node) => {
      if (node.type === 'text') return node.value;
      if (node.tagName === 'annotation' || node.properties?.className?.includes('katex-html')) return '';
      if (node.tagName === 'img') return node.properties?.alt ?? '';
      return node.children?.map(plain).join('') ?? '';
    };
    visit(tree, 'element', (node) => {
      if (!/^h[1-6]$/.test(node.tagName) || !node.properties?.id) return;
      let math = false;
      visit(node, 'element', (child) => { if (child.properties?.className?.includes('katex')) math = true; });
      if (math) labels[node.properties.id] = plain(node).replace(/[\u200b\u2061]/g, '');
    });
    file.data.astro ??= {};
    file.data.astro.frontmatter ??= {};
    file.data.astro.frontmatter.mathHeadingLabels = labels;
  };
}
