const input = require('fs').readFileSync('input.txt').toString();

const part1 = input
    .split('\n')
    .map(x => x.split(',').map(y => y.split('-').map(z => parseInt(z))))
    .filter(x => {
        return (x[0][0] <= x[1][0] && x[0][1] >= x[1][1]) ||
            (x[1][0] <= x[0][0] && x[1][1] >= x[0][1]);
    });


console.log('Part 1:',part1.length);

const part2 = input
    .split('\n')
    .map(x => x.split(',').map(y => y.split('-').map(z => parseInt(z))))
    .filter(x => {
        return x[0][0] <= x[1][1] && x[0][1] >= x[1][0];
    });


console.log('Part 2:', part2.length);