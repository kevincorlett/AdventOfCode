const fs = require('fs');
const path = require('path');
const inputFile='input.txt';
const filePath = path.resolve(__dirname, inputFile);
const input = fs.readFileSync(filePath).toString();

const lines = input.split('\n').map(x => x.split('').map(y => parseInt(y)));


let result = 0;

for(let l of lines){
    let max1 = 0, max2 = 0, max1Idx = 0;;
    for(let i=0; i<l.length-1;i++){
        if (l[i] > max1){
            max1 = l[i];
            max1Idx = i;
        }
    }

    for(let i = max1Idx+1; i<l.length;i++){
        if (l[i] > max2){
            max2 = l[i];
        }
    }

    result += max1*10 + max2;
}

console.log(result);