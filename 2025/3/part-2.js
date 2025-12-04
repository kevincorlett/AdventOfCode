const fs = require('fs');
const path = require('path');
const inputFile='input.txt';
const filePath = path.resolve(__dirname, inputFile);
const input = fs.readFileSync(filePath).toString();

const lines = input.split('\n').map(x => x.split('').map(y => parseInt(y)));
const nMax = 12;

let result = 0;

for(let l of lines){
    const maxs = [];
    let maxIdx = -1;
    for (let n=0; n<nMax; n++){
        maxs[n] = 0;

        for (let i=maxIdx+1; i<=l.length+n-nMax; i++){
            if (l[i] > maxs[n]){
                maxs[n] = l[i];
                maxIdx = i;
            }
        }
    }
    console.log(maxs.join(''));
    result += parseInt(maxs.join(''));
}

console.log(result);