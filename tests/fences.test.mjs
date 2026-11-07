import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeFences } from '../scripts/fences.mjs';

const fix = (text) => normalizeFences(text).text;

test('equal-length nesting is repaired so the outer block is longer', () => {
  const source = ':::theorem[T]{#thm-t}\n\n:::list{style="(i)"}\n1. a\n:::\n\n:::\n';
  assert.equal(fix(source), '::::theorem[T]{#thm-t}\n\n:::list{style="(i)"}\n1. a\n:::\n\n::::\n');
});

test('fence length is 3 plus nesting height, and over-long fences shrink', () => {
  const source = '::::::definition[D]\n:::::proof\n::::note\nx\n::::\n:::::\n::::::\n\n:::::lemma\ny\n:::::\n';
  assert.equal(fix(source), ':::::definition[D]\n::::proof\n:::note\nx\n:::\n::::\n:::::\n\n:::lemma\ny\n:::\n');
});

test('siblings do not inflate each other and indentation is preserved', () => {
  const source = '- item\n\n  :::note\n  a\n  :::\n\n:::proof\nb\n:::\n';
  const result = normalizeFences(source);
  assert.equal(result.text, source);
  assert.deepEqual(result.problems, []);
});

test('output is idempotent', () => {
  const once = fix(':::theorem\n:::proof\n:::list{style="a."}\n1. x\n:::\n:::\n:::\n');
  assert.equal(fix(once), once);
});

test('code blocks and display math are left alone', () => {
  const source = '```md\n:::theorem\n```\n\n$$\n:::\n$$\n\n:::note\nx\n:::\n';
  const result = normalizeFences(source);
  assert.equal(result.text, source);
  assert.deepEqual(result.problems, []);
});

test('unbalanced fences are reported with line numbers', () => {
  assert.deepEqual(normalizeFences(':::theorem\ntext\n').problems.map((p) => p.line), [1]);
  assert.deepEqual(normalizeFences('text\n:::\n').problems.map((p) => p.line), [2]);
});
