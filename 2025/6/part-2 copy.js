const fs = require('fs');
const path = require('path');
const inputFile='test.txt';
const filePath = path.resolve(__dirname, inputFile);
const input = fs.readFileSync(filePath).toString();
const rows = input.split('\n');

let results = [];

let operations = [...rows[rows.length-1].matchAll(/[+*/]/g)].map(x => x[0]);
rows.length -= 1;

let numbers = rows.map(x => [...x.matchAll(/\d+/g)].map(y => y[0]));//.map(y => ({ num: y[0], length: y[0].length })));

for (let i=0; i<operations.length; i++){
    const nums = numbers.map(x => x[i]);
    
    const maxLength = nums.reduce((a,b) => b.length > a ? b.length : a, 0);
    
    
    for (let j = maxLength; j > 0; j--){

    }

}


console.log(results.reduce((a,b) => a+b, 0));