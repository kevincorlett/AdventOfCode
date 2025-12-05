const fs = require('fs');
const path = require('path');
const inputFile='input.txt';
const filePath = path.resolve(__dirname, inputFile);
const input = fs.readFileSync(filePath).toString();

const halves = input.split('\n\n');

const freshNumbers = halves[0].split('\n').map(x => x.split('-')).map(x => ({ from: BigInt(x[0]), to: BigInt(x[1]) }));
const items = halves[1].split('\n').map(x => BigInt(x));

let result = 0;

for(const i of items){
    if (freshNumbers.some(x => x.from <= i && x.to >= i)){
        result ++;
    }
}

console.log(result);