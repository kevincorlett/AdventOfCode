const fs = require('fs');

const hrstart = process.hrtime.bigint();
const data = fs.readFileSync("./input.txt").toString();
const hrload = process.hrtime.bigint();

const allNumbers = data.split('\n').map(x => parseInt(x));
const hrParse = process.hrtime.bigint();

///////////////// PART 1 \\\\\\\\\\\\\\\\\\\\

const preamble = 25;
const numbersInPreamble = {};

for (let i = 0; i < preamble; i++) {
    numbersInPreamble[allNumbers[i]] = true;
}

let result1 = 0;
for (let i = preamble; i < allNumbers.length; i++) {
    const current = allNumbers[i]
    let found = false;
    for (let j = 1; j < preamble + 1; j++) {
        found = numbersInPreamble[current - allNumbers[i - j]];
        if (found)
            break;
    }
    if (!found) {
        result1 = current;
        break;
    }
    delete numbersInPreamble[allNumbers[i - preamble]];
    numbersInPreamble[current] = true;
}

hrpart1 = process.hrtime.bigint();

///////////////// PART 2 \\\\\\\\\\\\\\\\\\\\

let start = 0, end = 1, sum = allNumbers[0] + allNumbers[1];

while (sum !== result1 && end) {
    if (sum < result1)
        sum += allNumbers[++end];
    else
        sum -= allNumbers[start++];
}
const sorted = allNumbers.slice(start, end).sort();
const result2 = sorted[0] + sorted[sorted.length - 1];



const hrpart2 = process.hrtime.bigint();

console.log("result1 =", result1);
console.log("result2 =", result2);

console.log("Load\t\t", (hrload - hrstart) / 1000n, "μs")
console.log("Parse\t\t", (hrParse - hrload) / 1000n, "μs");
console.log("Part 1\t\t", (hrpart1 - hrParse) / 1000n, "μs");
console.log("Part 2\t\t", (hrpart2 - hrpart1) / 1000n, "μs");
console.log("Total\t\t", (hrpart2 - hrstart) / 1000n, "μs");