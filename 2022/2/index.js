const input = require('fs').readFileSync('input.txt').toString();

const inputLines = input.split('\n');

//part 1
const result = inputLines.reduce((x, y) => {
    return x + calculateResult(y[0], y[2]);
}, 0);

console.log('Part 1:', result);

//what beats what
const beats = { A: 'C', B: 'A', C: 'B'};
//what loses to what
const loses = { A: 'B', B: 'C', C: 'A' };

const result2 = inputLines.reduce((x,y) => {
    const myMove = y[2] === 'X' ? beats[y[0]] : y[2] === 'Z' ? loses[y[0]] : y[0];

    return x + calculateResult(y[0], myMove);
}, 0);

console.log('Part 2:', result2);

function calculateResult(a,b){
    const values = { A: 1, B: 2, C: 3, X: 1, Y: 2, Z: 3 }; 
    
    const outcome = values[b] - values[a];
    
    if (outcome === 1 || outcome === -2) return values[b] + 6; //win
    if (outcome === 0) return values[b] + 3; //draw
    return values[b]; //lose
}