const { assert } = require('chai');

const { safeSet } = require('../lib/utilities.js');

const fixtures = [
  {
    input: [{}, 'a', 'b'],
    expected: { a: 'b' },
    message: 'should set a value in an object',
  },
  {
    input: [{}, 'a.b', 'c'],
    expected: { a: { b: 'c' } },
    message: 'should set a value deeply in an object',
  },
  {
    input: [{ a: 'a' }, 'a', 'b'],
    expected: { a: 'b' },
    message: 'should overwrite a value',
  },
  {
    input: [{ a: { b: { c: 'c' } } }, 'a.b.c', 'z'],
    expected: { a: { b: { c: 'z' } } },
    message: 'should overwrite a deeply nested value',
  },
  {
    input: [{ a: {}, b: { c: 'c' } }, 'b.c', 'd'],
    expected: { a: {}, b: { c: 'd' } },
    message: 'should preserve values',
  },
  {
    input: [{ a: { b: { c: 'c', d: 'd' } } }, 'a.b.c', 'x'],
    expected: { a: { b: { c: 'x', d: 'd' } } },
    message: 'should preserve sibling values',
  },
  {
    input: [{ a: { b: { c: 'c', d: { e: 'e' } } } }, 'a.b.c', 'x'],
    expected: { a: { b: { c: 'x', d: { e: 'e' } } } },
    message: 'should preserve nested sibling values',
  },
];

describe('safeSet', function() {
  fixtures.forEach(({ input, expected, message }) => {
    it(message, function() {
      let [obj, dotpath, data] = input;
      let result = safeSet(obj, dotpath, data);
      assert.deepEqual(expected, result);
    });
  });
});
