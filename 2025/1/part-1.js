const fs = require('fs');
const path = require('path');
const inputFile='input.txt';
const filePath = path.resolve(__dirname, inputFile);
const input = fs.readFileSync(filePath).toString();

const moves = input.split('\n').map(x => {
    return x[0] === 'L' ?
        100-parseInt(x.substring(1)) :
        parseInt(x.substring(1));
});

let position = 50;
let result = 0;
for(let m of moves){

    position = (position + m) % 100;

    if (position === 0){
        result++;
    }
}

console.log(result);