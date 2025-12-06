const fs = require('fs');
const path = require('path');
const inputFile='input.txt';
const filePath = path.resolve(__dirname, inputFile);
const input = fs.readFileSync(filePath).toString();
const rows = input.split('\n');

let results = [];

let operations = [...rows[rows.length-1].matchAll(/[+*/]/g)].map(x => x[0]);

for(let i=0; i<rows.length-1;i++){
    let numbers = [...rows[i].matchAll(/\d+/g)].map(x => x[0]).map(x => parseInt(x));
    if (i === 0){
        results = numbers;
        continue;
    }

    for (let j=0;j<numbers.length;j++){
        switch (operations[j]){
            case '+':
                results[j] += numbers[j];
                break;
            case '*':
                results [j] *= numbers[j];
                break;
            default:
                throw Error(`Unknown operation: ${operations[j]}`)
        }
    }
}


console.log(results.reduce((a,b) => a+b));