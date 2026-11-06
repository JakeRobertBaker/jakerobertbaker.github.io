import test from 'node:test';
import assert from 'node:assert/strict';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import remarkDirective from 'remark-directive';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import mathBlocks, { createRegistry, failMathErrors, katexOptions, mathBlockHtml } from '../src/lib/math-blocks.mjs';
import { pageUrl, resolveReference } from '../src/lib/references.mjs';
import headingLabels from '../src/lib/heading-labels.mjs';
import listStyles from '../src/lib/list-styles.mjs';

const books = { JS: { name: 'Johnstone, Notes on Logic and Set Theory', short_name: 'Johnstone' }, KN: { name: 'Kunen, Set Theory', short_name: 'Kunen' } };
const renderer = await createMarkdownProcessor({
  smartypants: false, syntaxHighlight: false,
  remarkPlugins: [remarkMath, remarkDirective, listStyles, [mathBlocks, { books }]],
  rehypePlugins: [[rehypeKatex, katexOptions], failMathErrors, mathBlockHtml, headingLabels],
});
const render = (markdown, source = 'testing.md', frontmatter = {}) => renderer.render(markdown, {
  fileURL: new URL(`../src/content/docs/${source}`, import.meta.url), frontmatter,
});

test('blocks record rendered title and statement HTML without proofs, prefixes or IDs', async () => {
  const [theorem, proof, untitled] = (await render(`::::theorem[Square $x^2$]{#thm-sq}
Statement $y$.

:::proof[Theorem 1.2]{proves="#thm-sq"}
Proof $z$ uses [the result](#thm-sq).
:::
::::
:::proof{proves="#thm-sq" #prf-two}
Again.
:::
`)).metadata.frontmatter.mathBlocks;
  assert.match(theorem.titleHtml, /^Square <span class="katex">/);
  assert.doesNotMatch(theorem.titleHtml, /Theorem ·|math-permalink/);
  assert.match(theorem.html, /^<p>Statement <span class="katex">/);
  assert.doesNotMatch(theorem.html, /Proof|details|id=/);
  assert.equal(proof.titleHtml, 'Theorem 1.2');
  assert.match(proof.html, /^<p>Proof <span class="katex">.*<a href="\/testing\/#thm-sq">/);
  assert.match(untitled.titleHtml, /^Proof of Square <span class="katex">/);
  assert.doesNotMatch(untitled.titleHtml, /<a /);
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
  assert.match(result.code, /<summary class="math-block__title"><span class="math-block__kind">Proof · <\/span>A second argument/);
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
  for (const kind of ['definition', 'theorem', 'lemma', 'proposition', 'corollary', 'example', 'exercise', 'remark', 'notation']) {
    const result = await render(`:::${kind}{#block}\nStatement.\n:::`);
    assert.match(result.code, new RegExp(`math-block--${kind}`));
    assert.equal(result.metadata.frontmatter.mathBlocks[0].kind, kind);
  }
});

test('numbering: one page-wide series, fixed own numbers skipped, book numbers tagged separately', async () => {
  const result = await render(`:::theorem[First]{#thm-a}
A.
:::

:::lemma[From the book]{#lem-b n=1.3 book=JS}
B.
:::

:::definition{#def-c n=2}
C.
:::

:::exercise{#ex-d n=1.3 book=KN}
D.
:::

::::example[Last]{#exm-e}
E.

:::proof{proves="#exm-e"}
Nested proofs and solutions are not numbered.
:::
::::
`, 'testing.md', { numbering: true });
  const blocks = result.metadata.frontmatter.mathBlocks;
  assert.deepEqual(blocks.map((b) => [b.id, b.label, b.book?.id ?? null, b.title]), [
    ['thm-a', 'Theorem 1', null, 'First'],
    ['lem-b', 'Lemma 1.3', 'JS', 'From the book'],
    ['def-c', 'Definition 2', null, 'Definition 2'],
    ['ex-d', 'Exercise 1.3', 'KN', 'Exercise 1.3'],
    ['exm-e', 'Example 3', null, 'Last'],
    ['proof-exm-e', null, null, 'Proof of Example 3'],
  ]);
  assert.match(result.code, /<span class="math-block__kind">Lemma 1\.3 · <\/span>From the book<span class="math-block__source" title="Johnstone, Notes on Logic and Set Theory">Johnstone<\/span>/);
  assert.match(result.code, /<header class="math-block__title">Exercise 1\.3<span class="math-block__source"[^>]*>Kunen</);
  assert.equal(blocks[1].titleHtml, 'From the book');
  const plain = (await render(':::theorem[Unnumbered]{#thm-a}\nA.\n:::\n\n:::lemma{#lem-b n=4.1 book=JS}\nB.\n:::')).metadata.frontmatter.mathBlocks;
  assert.deepEqual(plain.map((b) => b.label), [null, 'Lemma 4.1'], 'fixed numbers work without auto-numbering');
});

test('solutions collapse like proofs, take default IDs and stay out of exercise statements', async () => {
  const result = await render('::::exercise[Show it]{#ex-one}\nStatement.\n\n:::solution{proves="#ex-one"}\nWorking.\n:::\n::::\n\n:::solution[Another way]{#sol-two proves="#ex-one" open}\nAgain.\n:::');
  assert.match(result.code, /<details class="math-block math-block--solution"[^>]*id="solution-ex-one">\n<summary class="math-block__title">Solution to <a href="#ex-one">Show it<\/a>/);
  assert.match(result.code, /<details[^>]*id="sol-two" open>/);
  const blocks = result.metadata.frontmatter.mathBlocks;
  assert.doesNotMatch(blocks[0].statement + blocks[0].html, /Working/);
  const registry = createRegistry([{ blocks }]);
  assert.equal(registry.blocks.find((b) => b.id === 'solution-ex-one').proves, '/testing/#ex-one');
});

test('references take their text from the target and link from prose and mathematics', async () => {
  const result = await render(`:::lemma[Substitution]{#lem-sub}
A.
:::

:::exercise{#ex-1-2 n=1.2 book=JS}
B.
:::

See [](#lem-sub), [](#ex-1-2) and [its own words](#lem-sub).

$$
\\begin{align*}
a & \\\\
\\by{lem-sub} &= b \\\\
\\by{#ex-1-2} &= c \\ref[x_1 & y]{lem-sub} \\ref[Kunen 2]{other.md#lem-k}
\\end{align*}
$$
`, 'testing.md', { numbering: true });
  assert.match(result.code, /See <a href="#lem-sub">Lemma 1<\/a>, <a href="#ex-1-2">Johnstone 1\.2<\/a> and <a href="#lem-sub">its own words<\/a>/);
  assert.match(result.code, /<span class="mord">\[<\/span><a href="#lem-sub"><span class="mord">Lemma 1<\/span><\/a><span class="mord">\]<\/span>/);
  assert.match(result.code, /<a href="#ex-1-2"><span class="mord">Johnstone 1\.2<\/span><\/a>/);
  assert.match(result.code, /<a href="#lem-sub"><span class="mord text"><span class="mord">x_1 &#x26; y<\/span>/);
  assert.match(result.code, /<a href="\/other\/#lem-k">/);
  const unnumbered = await render(':::lemma[Plain title]{#lem-p}\nA.\n:::\n\n:::lemma[Has $x$]{#lem-m}\nB.\n:::\n\nSee [](#lem-m) and $\\ref{lem-p}$.');
  assert.match(unnumbered.code, /See <a href="#lem-m">Has <span class="katex">/);
  assert.match(unnumbered.code, /<a href="#lem-p"><span class="mord text"><span class="mord">Plain title/);
});

test('numbering and reference mistakes fail with source context', async (t) => {
  t.mock.method(console, 'error', () => {});
  const numbered = (markdown) => render(markdown, 'testing.md', { numbering: true });
  for (const [markdown, message] of [
    [':::lemma{n=1.2 book=XX}\nA.\n:::', /Unknown book: XX \(known: JS, KN/],
    [':::lemma{book=JS}\nA.\n:::', /needs its number: \{n=1\.2 book=JS\}/],
    [':::lemma{n=1.2 book=JS}\nA.\n:::\n\n:::theorem{n=1.2 book=JS}\nB.\n:::', /Duplicate number 1\.2 for book JS/],
    [':::lemma{n=3}\nA.\n:::\n\n:::theorem{n=3}\nB.\n:::', /Duplicate number 3$/],
    [':::lemma{n="1 2"}\nA.\n:::', /Invalid number: 1 2/],
    [':::proof{n=1}\nA.\n:::', /Unknown proof metadata: n/],
    ['See [](#missing).', /no block with ID missing/],
    ['See [](other.md#lem-x).', /another page needs text/],
    ['$\\by{missing}$', /\\by\{missing\}: no block with ID missing/],
    ['$\\ref{other.md#lem-x}$', /needs its text: \\ref\[Text\]/],
  ]) await assert.rejects(numbered(markdown), message, markdown);
  // On unnumbered pages a title with math cannot be set in \text{}.
  await assert.rejects(render(':::lemma[Has $x$]{#lem-m}\nA.\n:::\n\n$\\by{lem-m}$'), /needs its text: \\by\[Text\]\{lem-m\}/);
  // Book-numbered results do not collide with the page's own numbers.
  await numbered(':::lemma{n=1 book=JS}\nA.\n:::\n\n:::theorem\nB.\n:::\n\n:::theorem{n=1 book=KN}\nC.\n:::');
});

test('the books file loads and rejects malformed entries', async (t) => {
  const { loadBooks } = await import('../src/lib/books.mjs');
  const { mkdtemp, writeFile } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  assert.ok(loadBooks(new URL('../src/data/books.yaml', import.meta.url)).JS.short_name);
  const dir = await mkdtemp(`${tmpdir()}/books-`);
  for (const [yaml, message] of [
    ['JS:\n  name: Johnstone\n', /needs a short_name/],
    ['JS:\n  name: J\n  short_name: J\n  year: 1987\n', /unknown field year/],
    ['"1X":\n  name: J\n  short_name: J\n', /invalid book ID 1X/],
  ]) {
    await writeFile(`${dir}/books.yaml`, yaml);
    assert.throws(() => loadBooks(`${dir}/books.yaml`), message);
  }
});

test('contents entries record top-level blocks with their headings and plain labels', async () => {
  const result = await render(`:::definition[Before any heading]{#def-a}
A.
:::

## Section $F_\\Omega$

::::theorem[Sum $x+y$]{#thm-b n=1.1 book=JS}
B.

:::remark{#rem-nested}
Nested blocks stay out of the contents.
:::
::::

:::proof{proves="#thm-b"}
Proofs too.
:::

### Sub

:::lemma{#lem-c}
C.
:::

## Next

:::note{#note-d}
Asides too.
:::
`, 'testing.md', { numbering: true });
  assert.deepEqual(result.metadata.frontmatter.mathContents, [
    { id: 'def-a', kind: 'definition', sections: [], text: 'Definition 1 · Before any heading' },
    { id: 'thm-b', kind: 'theorem', sections: ['section-f_omega'], text: 'Theorem 1.1 · Sum x+y' },
    { id: 'lem-c', kind: 'lemma', sections: ['section-f_omega', 'sub'], text: 'Lemma 3' },
  ]);
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

test('list directives set one marker per nesting level, inside blocks and out', async (t) => {
  const { code, metadata } = await render(`::::definition[D]{#def-d}
:::list{style="(a) (i)"}
1. $x$

    1. nested
:::
::::`);
  assert.match(code, /<div class="list-styles" style="--list-1: paren-lower-alpha; --list-2: paren-lower-roman"><ol>\s*<li>/);
  assert.match(metadata.frontmatter.mathBlocks[0].html, /^<div class="list-styles"/);
  assert.match((await render(':::list{style="A."}\n1. One\n:::')).code, /style="--list-1: upper-alpha"/);
  t.mock.method(console, 'error', () => {});
  for (const [markdown, message] of [
    [':::list\n1. A\n:::', /list needs 1–3 marker styles/],
    [':::list{style="a. i. 1. A."}\n1. A\n:::', /list needs 1–3 marker styles/],
    [':::list{style="(b)"}\n1. A\n:::', /Unknown list marker "\(b\)"/],
    [':::list{style="a." #x}\n1. A\n:::', /Unknown list metadata: id/],
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
