const assert = require('node:assert/strict');
const utils = require('./index.js');

// getPrimes
assert.deepEqual(utils.getPrimes(100), [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
  31, 37, 41, 43, 47, 53, 59, 61, 67,
  71, 73, 79, 83, 89, 97
]);
assert.deepEqual(utils.getPrimes(10), [
  2, 3, 5, 7
]);
// highestCommonFactor
assert.strictEqual(utils.highestCommonFactor([21, 14]), 7);
assert.strictEqual(utils.highestCommonFactor([5, -40, 20, 10]), 5);
assert.strictEqual(utils.highestCommonFactor([140, 70, 7]), 7);
assert.strictEqual(utils.highestCommonFactor([140, 11]), 1);

console.log('All assertions passed.');