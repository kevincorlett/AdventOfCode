const fs = require('fs');
const path = require('path');
const inputFile='input.txt';
const filePath = path.resolve(__dirname, inputFile);
const input = fs.readFileSync(filePath).toString();
const lines = input.split('\r\n').map(x => x.split(''));

const cache = {};

let result = 0;
let beamIdx = input.indexOf('S');

result = tracePath(1, beamIdx);

console.log(result);


function tracePath(line, idx){

    const key = `${line}:${idx}`;
    if (cache[key]){
        return cache[key];
    }

    while (++line < lines.length && lines[line][idx] !== '^'){
        //noop
    }

    if (line < lines.length){
        return cache[key] = tracePath(line+1, idx-1) + tracePath(line+1, idx+1);
    }

    return cache[key] = 1;
}