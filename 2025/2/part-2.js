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
        if (i < 10n){
            continue;
        }

        //odd length numbers - only check for the same single number repeated
        //even length numbers - go through all number lengths that are equally divisible
        //into the number and check for repetitions
        const numStr = i.toString();
        for (let l = 1; l <= numStr.length/2; l++){
            if (numStr.length % l !== 0){
                continue;
            }

            let repeat = true;
            for (let pos = l; repeat && pos < numStr.length; pos++){
                repeat = numStr[pos-l] === numStr[pos];
            }

            if (repeat){
                result += i;
                break;
            }
        }
        
    }
}
console.log(result);