const fs = require('fs');
const path = require('path');

function readFile(filename){
    const filePath = path.resolve(__dirname, filename);
    return fs.readFileSync(filePath).toString();
}

const input = readFile('input.txt');
const inputLines = input.split('\n');

const left = new Array(inputLines.length);
const right = new Array(inputLines.length);

for (let x=0;x<inputLines.length;x++){
    const nums = inputLines[x].split('   ');
    left[x] = parseInt(nums[0]);
    right[x] = parseInt(nums[1]);
}

left.sort((a,b) => a-b);
right.sort((a,b) => a-b);

let result = 0;
for (let x=0;x<left.length && x<right.length;x++){
    const diff = left[x] - right[x];
    if (diff > 0){
        result += diff;
    } else {
        result -= diff;
    }
}

console.log(result);