const fs = require('fs');
const path = require('path');
const inputFile='input.txt';
const filePath = path.resolve(__dirname, inputFile);
const input = fs.readFileSync(filePath).toString();
const utils = require('../../js-utils');

const ranges = input.split(',')
    .map(x => x.split('-'))
    .map(x => ({ from: BigInt(x[0]), to: BigInt(x[1])}));

let result = 0n;
for(const r of ranges){
    for (let i=r.from;i<=r.to;i++){
        
        const numStr = i.toString();
        if (numStr.length % 2 !== 0){
            continue;
        }
        
        if (numStr.substring(0,numStr.length/2) === numStr.substring(numStr.length/2)){
            result += i;
        }

    }
}
console.log(result);