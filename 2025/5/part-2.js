const fs = require('fs');
const path = require('path');
const inputFile='input.txt';
const filePath = path.resolve(__dirname, inputFile);
const input = fs.readFileSync(filePath).toString();

const halves = input.split('\n\n');

const freshNumbers = halves[0]
    .split('\n')
    .map(x => x.split('-'))
    .map(x => ({ from: BigInt(x[0]), to: BigInt(x[1]) }))
    .sort((a, b) => a.from === b.from ? 0 : a.from > b.from ? 1 : -1);

let result = 1n + freshNumbers[0].to - freshNumbers[0].from;
let maxTo = freshNumbers[0].to;

for (let i=1;i< freshNumbers.length; i++){
    //this range sits entirely within a previous range
    if (freshNumbers[i].to <= maxTo){
        continue;
    }
    
    //this range overlaps a previous range
    if (freshNumbers[i].from <= maxTo){
        result += freshNumbers[i].to - maxTo;
    }

    //this range sits entirely outside the previous range
    else {
        result += 1n + freshNumbers[i].to - freshNumbers[i].from;
    }

    maxTo = freshNumbers[i].to;

}


console.log(result);