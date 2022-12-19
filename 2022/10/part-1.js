const input = require('fs').readFileSync('input.txt').toString();

const inputLines = input.split('\n');

const interestingCycles = [220, 180, 140, 100, 60];
let nextInterestingCycle = 20, x = 1, result = 0, cycle = 0;

for(let i=0; i<inputLines.length && nextInterestingCycle !== undefined; i++){
    
    const cmd = inputLines[i].split(' ');
    const noop = cmd[0] === 'noop';
    cycle++;
    
    if (!noop){
        cycle++;
    }

    if (cycle >= nextInterestingCycle){
        result += (nextInterestingCycle*x);
        nextInterestingCycle = interestingCycles.pop();
    }

    if (!noop){
        x+= parseInt(cmd[1]);
    }
}

if (nextInterestingCycle !== undefined){
    result += nextInterestingCycle * x;
}

console.log('Part 1:', result);