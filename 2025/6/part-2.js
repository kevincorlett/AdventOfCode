const fs = require('fs');
const path = require('path');
const inputFile='input.txt';
const filePath = path.resolve(__dirname, inputFile);
const input = fs.readFileSync(filePath).toString();
const rows = input.split('\n');

let results = [];
let numbers = [];
for (let i=rows[0].length-1; i > -1; i--){
    let numArr = [];
    let op = '';
    for (let j = 0; j < rows.length; j++){
        let char = rows[j][i];
        if (char === '+' || char === '*'){
            op = char;
        }
        else if (char !== ' '){
            numArr.push(rows[j][i]);
        }
    }
    numbers.push(parseInt(numArr.join('')));
    if (op === '+'){
        results.push(numbers.reduce((a,b) => a+b)); 
    }
    if (op === '*'){
        results.push(numbers.reduce((a,b) => a*b, 1));
    }
    if (op !== ''){
        numbers = [];
        i--;
    }
}


console.log(results.reduce((a,b) => a+b, 0));