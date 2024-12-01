const fs = require('fs');
const path = require('path');

function readFile(filename){
    const filePath = path.resolve(__dirname, filename);
    return fs.readFileSync(filePath).toString();
}


const input = readFile('input.txt');
const inputLines = input.split('\n');

const rightCounts = [];
const lefts = new Array(inputLines.length);

for (let x=0;x<inputLines.length;x++){
    const nums = inputLines[x].split('   ').map(y => parseInt(y));

    lefts[x] = nums[0];

    if (rightCounts[nums[1]] !== undefined){
        rightCounts[nums[1]] += 1;
    } else {
        rightCounts[nums[1]] = 1;
    }
}

let result = 0;
for (let x=0;x<lefts.length;x++){
    result += lefts[x] * (rightCounts[lefts[x]] || 0);
}

console.log(result);
