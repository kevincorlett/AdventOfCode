const fs = require('fs');

const hrstart = process.hrtime.bigint();
const data = fs.readFileSync("./input.txt").toString();
const hrload = process.hrtime.bigint();

const allNumbers = data.split('\n').map(x => parseInt(x));
const hrParse = process.hrtime.bigint();

const preamble = 25;
const numbersInPreamble = {};

for (let i = 0; i < preamble; i++) {
    numbersInPreamble[allNumbers[i]] = true;
}

let result = 0;
for (let i = preamble; i < allNumbers.length; i++) {
    const current = allNumbers[i]
    let found = false;
    for (let j = 1; j < preamble + 1; j++) {
        // console.log(current, allNumbers[i - j], current - allNumbers[i - j]);
        found = numbersInPreamble[current - allNumbers[i - j]];
        if (found)
            break;
    }
    if (!found) {
        result = current;
        break;
    }
    delete numbersInPreamble[allNumbers[i-preamble]];
    numbersInPreamble[current] = true;
}



const hrProcess = process.hrtime.bigint();

console.log("\nresult =", result);

console.log("Load\t\t", (hrload - hrstart) / 1000n, "μs")
console.log("Parse\t\t", (hrParse - hrload) / 1000n, "μs");
console.log("Process\t\t", (hrProcess - hrParse) / 1000n, "μs");
console.log("Total\t\t", (hrProcess - hrstart) / 1000n, "μs");