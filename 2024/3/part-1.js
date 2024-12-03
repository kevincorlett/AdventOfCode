const fs = require('fs');
const path = require('path');

function readFile(filename){
    const filePath = path.resolve(__dirname, filename);
    return fs.readFileSync(filePath).toString();
}

const input = readFile('input-3.txt');

const matches = [...input.matchAll(/mul\((\d+)\,(\d+)\)/g)];

const result = matches
            .map(x => parseInt(x[1]) * parseInt(x[2]))
            .reduce((a,b) => a+b);


console.log(result);