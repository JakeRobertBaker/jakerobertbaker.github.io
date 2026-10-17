import test from 'node:test';
import assert from 'node:assert/strict';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import mathBlocks, { createRegistry, failMathErrors } from '../src/lib/math-blocks.mjs';
import { pageUrl, resolveReference } from '../src/lib/references.mjs';

const renderer = await createMarkdownProcessor({
  smartypants: false, syntaxHighlight: false,
  remarkPlugins: [remarkMath, remarkDirective, mathBlocks],
  rehypePlugins: [rehypeKatex, failMathErrors],
});
const render = (markdown, source = 'testing.md') => renderer.render(markdown, {
  fileURL: new URL(`../src/content/docs/${source}`, import.meta.url),
});

test('semantic blocks, nested proofs, title math, explicit metadata and no inferred edges', async () => {
  const result = await render(`::::theorem[An identity $x=x$]{#thm-id}
The statement $x=x$.

:::proof[Proof]{#proof-id proves="#thm-id" uses="other.md#lem-id" open}
A proof linking to [another result](#thm-id).
:::
::::
`);
  assert.match(result.code, /<section class="math-block math-block--theorem"[^>]*id="thm-id"/);
  assert.match(result.code, /<details[^>]*id="proof-id"[^>]*open/);
  assert.match(result.code, /<summary class="math-block__title">/);
  assert.match(result.code, /katex/);
  const blocks = result.metadata.frontmatter.mathBlocks;
  assert.equal(blocks.length, 2);
  assert.match(blocks[0].statement, /The statement \$x=x\$/);
  assert.doesNotMatch(blocks[0].statement, /A proof/);
  assert.deepEqual(blocks[0].uses, []);
  const other = (await render(':::lemma[Identity]{#lem-id}\nOther statement.\n:::', 'other.md')).metadata.frontmatter.mathBlocks;
  const input = [{ blocks }, { blocks: other }];
  const registry = createRegistry(input);
  assert.equal(registry.blocks.find((b) => b.id === 'proof-id').proves, '/testing/#thm-id');
  assert.deepEqual(registry.blocks.find((b) => b.id === 'proof-id').uses, ['/other/#lem-id']);
  assert.equal(blocks[1].proves, '#thm-id', 'aggregation must not mutate cached page metadata');
  assert.deepEqual(createRegistry(input), registry);
});

test('proofs default closed; IDs on native asides and literal code remain intact', async () => {
  const result = await render(':::proof\nA proof.\n:::\n\n:::note[Remark]{#rem-one}\nA note.\n:::\n\n```md\n:::theorem{#fake}\n```');
  assert.doesNotMatch(result.code, /<details[^>]*open/);
  assert.match(result.code, /id="rem-one"/);
  assert.equal(result.metadata.frontmatter.mathBlocks.length, 1);
});

test('legacy heading IDs use source math, reserve IDs, and retain repeated-heading suffixes', async () => {
  const result = await render('<span id="a-heading"></span>\n\n## A heading\n\n### $n < m$ [1.01]\n\n## A heading');
  assert.match(result.code, /id="a-heading_1"/);
  assert.match(result.code, /id="n-m-101"/);
  assert.match(result.code, /id="a-heading_2"/);
});

test('metadata and KaTeX errors fail with source context', async () => {
  for (const [markdown, message] of [
    [':::theorem{#x}\nOne.\n:::\n\n:::lemma{#x}\nTwo.\n:::', /Duplicate block ID/],
    [':::theorem{wrong="x"}\nOne.\n:::', /Unknown theorem metadata/],
    [':::proof{proves="#x"}\nOne.\n:::', /explicit stable ID/],
    [':::proof{#p uses="#x"}\nOne.\n:::', /explicit proves target/],
    [':::proof{open="false"}\nOne.\n:::', /boolean/],
    ['$\\noSuchCommand$', /Undefined control sequence/],
  ]) await assert.rejects(render(markdown), message);
});

test('registry rejects unresolved references and does not retain deleted entries', async () => {
  const blocks = (await render(':::proof{#p proves="#missing"}\nProof.\n:::')).metadata.frontmatter.mathBlocks;
  assert.throws(() => createRegistry([{ blocks }]), /testing.md:1: unknown dependency/);
  assert.deepEqual(createRegistry([]), { version: 1, blocks: [] });
});

test('one resolver preserves legacy routes, case, fragments and queries', () => {
  assert.equal(pageUrl('mathematics/linear_models/linear_models.md'), '/mathematics/linear_models/linear_models/');
  assert.equal(pageUrl('index.md'), '/');
  assert.equal(resolveReference('../exercises_2A.md?view=1#ID', 'analysis/chapter/note.md'), '/analysis/exercises_2A/?view=1#ID');
  assert.equal(resolveReference('../figure.svg', 'analysis/chapter/note.md'), '/analysis/figure.svg');
  assert.equal(resolveReference('#def-x', 'note.md'), '#def-x');
  assert.equal(resolveReference('https://example.com/x.md#y', 'note.md'), 'https://example.com/x.md#y');
  assert.throws(() => resolveReference('../../secret', 'note.md'), /escapes the content root/);
});
