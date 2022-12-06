const input = require('fs').readFileSync('input.txt');

console.log('Part 1:', findResult(4));

console.log('Part 2:', findResult(14));

function findResult(count) {
    const s = new Set();
    let result = 0;
    for (let i = count; i < input.length && result === 0; i++) {
        s.clear();
        for (let j = i - count; j < i; j++) {
            s.add(input[j]);
        }
        if (s.size === count) {
            result = i;
        }
    }
    return result;
}
