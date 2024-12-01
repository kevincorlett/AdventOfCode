const fs = require('fs');

// const input = fs.readFileSync('test-1.txt');
const input = fs.readFileSync('input.txt');
const inputLines = input.toString().split('\n');

const parsed = inputLines.map(x => x.split(' ').map(x => parseInt(x)).reverse());

let result = 0;

for(let line of parsed){
    result += getNext(line);
}

console.log('Part 1:', result);


function getNext(sequence){
    const diffs = sequence.slice(1).map((x, i) => x - sequence[i]);

    let next = 0;
    if (diffs.some(x => x !== 0)){
        //we're not yet at the bottom, go to the next level down
        next = getNext(diffs); 
    }
    
    return next + sequence[sequence.length-1];
}