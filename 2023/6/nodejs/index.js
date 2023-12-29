const fs = require('fs');

const input = fs.readFileSync('input.txt');
const inputLines = input.toString().split('\n');
const timeMatches = inputLines[0].matchAll(/\d+/g);
const distanceMatches = inputLines[1].matchAll(/\d+/g);

const times = [...timeMatches].map(x => parseInt(x[0]));
const distances = [...distanceMatches].map(x => parseInt(x[0]));

let result = 1;

for (let i = 0; i < times.length; i++){
    result *= getNumberOfSolutions(times[i], distances[i]);
}


console.log('Part 1:', result);

result = 0;

const time = parseInt(inputLines[0].replace(/\s/g, '').match(/\d+/)[0]);
const distance = parseInt(inputLines[1].replace(/\s/g, '').match(/\d+/)[0]);

result = getNumberOfSolutions(time, distance);

console.log('Part 2:', result);



function getNumberOfSolutions (time, distance){
    const j = solveQuadratic(1, -time, distance);

    let low = Math.ceil(j[0]);
    if (low === j[0]){
        low++;
    }

    let high = Math.floor(j[1]);
    if (high === j[1]){
        high--;
    }

    return high - low + 1;
}

function solveQuadratic(a, b, c){
    const _sqrt = Math.sqrt(b*b - 4*a*c);
    const _2a = 2*a;
   
    return [
        (-b - _sqrt) / _2a,
        (-b + _sqrt) / _2a
    ]
}