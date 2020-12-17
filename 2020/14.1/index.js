const fs = require('fs');

const hrstart = process.hrtime.bigint();
const input = fs.readFileSync("./input.txt");
const hrload = process.hrtime.bigint();

const lines = input.toString().split('\n');


const hrParse = process.hrtime.bigint();
let maskOr = 0n, maskAnd = 0n;
let maskedValues = {};
for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split(' = ');
    if (parts[0] === 'mask') {
        maskOr = maskAnd = 0n;
        for (let j = 0; j < parts[1].length; j++) {
            maskOr <<= 1n;
            maskAnd <<= 1n;
            
            switch (parts[1][j]) {
                case 'X':
                    maskAnd |= 1n;
                    break;
                case '1':
                    maskOr |= 1n;
                    break;
            }
        }
        continue;
    }

    const index = parts[0].match(/\[(\d+)\]/)[1];
    const premask = BigInt(parts[1]);
    maskedValues[index] = (premask & maskAnd) | maskOr;
    // console.log(i, maskAnd, maskOr, index, premask);
}

const result = Object.values(maskedValues).reduce((x,y) => x+y);

const hrProcess = process.hrtime.bigint();

console.log("result =", result);

console.log("Load\t\t", (hrload - hrstart) / 1000n, "μs")
console.log("Parse\t\t", (hrParse - hrload) / 1000n, "μs");
console.log("Process\t\t", (hrProcess - hrParse) / 1000n, "μs");
console.log("Total\t\t", (hrProcess - hrstart) / 1000n, "μs");

