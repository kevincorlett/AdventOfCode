const input = require('fs').readFileSync('input.txt').toString();

const inputLines = input.split('\n');

//part 1
let max = 0, current = 0, index = 0, result = 0;
for (let i = 0; i <= inputLines.length; i++) {
    if (inputLines[i] === '' || inputLines[i] === undefined) {
        if (current > max) {
            max = current;
        }
        current = 0;
        continue;
    }

    current += parseInt(inputLines[i]);
}

console.log('Part 1:', max);

//part 2
const result2 = input
        .split('\n\n')
        .map(x => x
            .split('\n')
            .map(x => parseInt(x))
            .reduce((x,y) => x+y))
        .sort((x,y) => y - x)
        .slice(0, 3)
        .reduce((x,y) => x + y);

console.log(result2);