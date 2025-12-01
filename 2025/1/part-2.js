const fs = require('fs');
const path = require('path');
const inputFile='input.txt';
const filePath = path.resolve(__dirname, inputFile);
const input = fs.readFileSync(filePath).toString();

const moves = input.split('\n').map(x => ({
    dir: x[0] === 'L' ? -1 : 1,
    count: parseInt(x.substring(1))
}));

let position = 50;
let result = 0;
for(let m of moves){
    for (let i=0; i<m.count; i++){
        position = (position + m.dir) % 100;
        if (position === 0){
            result++;
        }
    }
}

console.log(result);