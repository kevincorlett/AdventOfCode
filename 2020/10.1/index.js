const fs = require('fs');

const hrstart = process.hrtime.bigint();
const data = fs.readFileSync("./input.txt").toString();
const hrload = process.hrtime.bigint();

const numbers = data.split('\n').map(x => parseInt(x));

const hrParse = process.hrtime.bigint();

const sorted = [0, ...numbers.sort((a,b) => a-b)];

let ones = 0, threes = 0;
for (let i=1;i<sorted.length;i++){
    const delta = sorted[i] - sorted[i-1];

    if (delta === 1)
        ones++;

    if (delta === 3)
        threes++;
}

//add one to threes to allow for the device itself
const result = ones * (threes+1);

const hrProcess = process.hrtime.bigint();

console.log("\nresult =", result);

console.log("Load\t\t", (hrload - hrstart) / 1000n, "μs")
console.log("Parse\t\t", (hrParse - hrload) / 1000n, "μs");
console.log("Process\t\t", (hrProcess - hrParse) / 1000n, "μs");
console.log("Total\t\t", (hrProcess - hrstart) / 1000n, "μs");