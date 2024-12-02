const fs = require('fs');
const path = require('path');

function readFile(filename){
    const filePath = path.resolve(__dirname, filename);
    return fs.readFileSync(filePath).toString();
}

const input = readFile('input.txt');
const inputLines = input.split('\n');

let result = 0;

function isReportSafe(report, levelRemoved) {
    let isSafe = true;

    //check direction of first pair of levels - for report to be safe all subsequent pairs must be going the same way
    const increasing = report[1] > report[0];

    for(let i=0; isSafe && i<report.length-1; i++){
        const diff = report[i+1] - report[i];

        isSafe = diff !== 0 && diff > -4 && diff < 4 && (diff > 0) === increasing;
    }

    //if report is unsafe, and we haven't tried removing a level, then 
    //try removing levels
    if (!isSafe && !levelRemoved){
        for (let i=0; !isSafe && i<report.length; i++){
            isSafe = isReportSafe(report.toSpliced(i,1), true);
        }
    }

    return isSafe;
}

result = inputLines
            .map(x => x.split(' ')
            .map(y => parseInt(y)))
            .filter(x => isReportSafe(x))
            .length;

console.log(result);