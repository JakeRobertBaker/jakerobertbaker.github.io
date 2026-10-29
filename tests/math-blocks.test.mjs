import test from 'node:test';
import assert from 'node:assert/strict';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import mathBlocks, { createRegistry, failMathErrors } from '../src/lib/math-blocks.mjs';
import { pageUrl, resolveReference } from '../src/lib/references.mjs';
import headingLabels from '../src/lib/heading-labels.mjs';

const renderer = await createMarkdownProcessor({
  smartypants: false, syntaxHighlight: false,
  remarkPlugins: [remarkMath, remarkDirective, mathBlocks],
  rehypePlugins: [rehypeKatex, failMathErrors, headingLabels],
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

test('untitled proofs are named after, link to and take their ID from what they prove', async () => {
  const result = await render(`:::proof{proves="#lem-id" open}
Proof before its statement.
:::

:::lemma[An identity $x=x$]{#lem-id}
Statement.
:::

:::proof[A second argument]{#proof-lem-id-alt proves="testing.md#lem-id"}
Another proof.
:::

:::theorem{#thm-untitled}
Statement.
:::

:::proof{proves="#thm-untitled"}
Proof.
:::
`);
  assert.match(result.code, /<details[^>]*id="proof-lem-id"[^>]*open[\s\S]*?<summary class="math-block__title">Proof of <a href="#lem-id">An identity <span class="katex">/);
  assert.match(result.code, /<summary class="math-block__title">Proof · A second argument/);
  assert.match(result.code, /<summary class="math-block__title">Proof of <a href="#thm-untitled">Theorem<\/a>/);
  const registry = createRegistry([{ blocks: result.metadata.frontmatter.mathBlocks }]);
  const proofs = registry.blocks.filter((b) => b.kind === 'proof');
  assert.deepEqual(proofs.map((b) => [b.id, b.title, b.proves]), [
    ['proof-lem-id', 'Proof of An identity $x=x$', '/testing/#lem-id'],
    ['proof-lem-id-alt', 'A second argument', '/testing/#lem-id'],
    ['proof-thm-untitled', 'Proof of Theorem', '/testing/#thm-untitled'],
  ]);
});

test('proofs default closed; IDs on native asides and literal code remain intact', async () => {
  const result = await render(':::proof\nA proof.\n:::\n\n:::note[Remark]{#rem-one}\nA note.\n:::\n\n```md\n:::theorem{#fake}\n```');
  assert.doesNotMatch(result.code, /<details[^>]*open/);
  assert.match(result.code, /id="rem-one"/);
  assert.equal(result.metadata.frontmatter.mathBlocks.length, 1);
});

test('remarks and notation are referenceable exposition, not inferred proof results', async () => {
  const result = await render(`:::remark[Remark]{#rem-one}
A remark with $x=x$.
:::

:::notation[Notation]{#not-one}
Let $X$ denote the space.
:::

:::theorem{#thm-one}
A result.
:::
`);
  assert.match(result.code, /<section class="math-block math-block--remark"[^>]*id="rem-one"/);
  assert.match(result.code, /<section class="math-block math-block--notation"[^>]*id="not-one"/);
  assert.match(result.code, /aria-label="Link to this remark"/);
  assert.doesNotMatch(result.code, /Remark · Remark|Notation · Notation/);
  const blocks = result.metadata.frontmatter.mathBlocks;
  assert.deepEqual(blocks.map(block => block.kind), ['remark', 'notation', 'theorem']);
  const registry = createRegistry([{ blocks }]);
  assert.ok(registry.blocks.some(block => block.url === '/testing/#rem-one'));
  assert.ok(registry.blocks.every(block => block.uses.length === 0 && block.proves === null));
  for (const relationship of ['proves="#rem-one"', 'proves="#thm-one" uses="#not-one"']) {
    const proof = (await render(`:::proof[Proof]{#p ${relationship}}\nProof.\n:::`)).metadata.frontmatter.mathBlocks;
    assert.throws(() => createRegistry([{ blocks: [...blocks, ...proof] }]), /dependency is not a result/);
  }
  const nested = await render('::::proof\n:::remark{#nested-remark}\nA remark inside a proof.\n:::\n::::');
  assert.match(nested.code, /<details[\s\S]*class="math-block math-block--remark"/);
});

test('all statement kinds retain their own semantic class and label', async () => {
  for (const kind of ['definition', 'theorem', 'lemma', 'proposition', 'corollary', 'example', 'remark', 'notation']) {
    const result = await render(`:::${kind}{#block}\nStatement.\n:::`);
    assert.match(result.code, new RegExp(`math-block--${kind}`));
    assert.equal(result.metadata.frontmatter.mathBlocks[0].kind, kind);
  }
});

test('legacy heading IDs use source math, reserve IDs, and retain repeated-heading suffixes', async () => {
  const result = await render('<span id="a-heading"></span>\n\n## A heading\n\n### $n < m$ [1.01]\n\n## A heading');
  assert.match(result.code, /id="a-heading_1"/);
  assert.match(result.code, /id="n-m-101"/);
  assert.match(result.code, /id="a-heading_2"/);
});

test('mathematical contents labels contain presentation text once, preserving heading HTML and IDs', async () => {
  const result = await render('## Apply **Egorov** to each finite $(m,m+1)$, $n\\in\\mathbb{Z}$\n\n### An identity $x=x$\n\n## Ordinary heading');
  assert.deepEqual(result.metadata.frontmatter.mathHeadingLabels, {
    'apply-egorov-to-each-finite-mm1-ninmathbbz': 'Apply Egorov to each finite (m,m+1), n∈Z',
    'an-identity-xx': 'An identity x=x',
  });
  assert.match(result.code, /class="katex-html"/);
  assert.match(result.code, /<annotation encoding="application\/x-tex">/);
  assert.match(result.code, /id="apply-egorov-to-each-finite-mm1-ninmathbbz"/);
  assert.equal(result.metadata.headings.length, 3);
});

test('metadata and KaTeX errors fail with source context', async (t) => {
  // Astro logs before rejecting. Silence only these intentional failures;
  // assert.rejects still reports any missing rejection or unexpected error.
  t.mock.method(console, 'error', () => {});
  for (const [markdown, message] of [
    [':::theorem{#x}\nOne.\n:::\n\n:::lemma{#x}\nTwo.\n:::', /Duplicate block ID/],
    [':::theorem{wrong="x"}\nOne.\n:::', /Unknown theorem metadata/],
    [':::remark{open}\nOne.\n:::', /Unknown remark metadata/],
    [':::notation{proves="#x"}\nOne.\n:::', /Unknown notation metadata/],
    [':::proof{proves="other.md#x"}\nOne.\n:::', /another page needs a title/],
    [':::proof{proves="other.md"}\nOne.\n:::', /must name a block/],
    [':::lemma{#x}\nOne.\n:::\n\n:::proof{proves="#x"}\nA.\n:::\n\n:::proof{proves="#x"}\nB.\n:::', /give further proofs their own/],
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
