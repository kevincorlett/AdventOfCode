const fs = require('fs');
const path = require('path');

function readFile(filename){
    const filePath = path.resolve(__dirname, filename);
    return fs.readFileSync(filePath).toString();
}

const input = readFile('input.txt');
const inputLines = input.split('\n');

let result = 0;

const isLineSafe = line => {
    const reports = line.split(' ').map(x => parseInt(x));
    
    const increasing = reports[1] > reports[0];
    for(let i=0;i<reports.length-1;i++){
        const diff = reports[i+1] - reports[i];

        if (diff === 0 || diff < -3 || diff > 3 || (diff > 0) !== increasing){
            return false;
        }
    }

    return true;
};

result = inputLines.filter(x => isLineSafe(x)).length;

console.log(result);