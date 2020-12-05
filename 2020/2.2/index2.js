
const hrstart = process.hrtime.bigint();
const file = require('fs').readFileSync('input.txt');

let lineStart = 0, lineEnd = 0;
let matchingPasswords = 0;

while(lineEnd > -1){
    lineEnd = file.indexOf(0x0A, lineStart);
    const line = file.subarray(lineStart, lineEnd).toString();
    lineStart = lineEnd + 1;
    const matches = line.match(/^(\d+)\-(\d+)\s(\w):\s(\w+)$/);

    const min = parseInt(matches[1]);
    const max = parseInt(matches[2]);
    const char = matches[3][0];
    const pwd = matches[4];

    if (pwd.length < max) {
        continue;
    }

    const isAtMin = pwd[min - 1] === char, isAtMax = pwd[max - 1] === char;
    if (isAtMin ? !isAtMax : isAtMax) {
        matchingPasswords++;
    }

}

console.log(`There are ${matchingPasswords} matching passwords`);
const hrend = process.hrtime.bigint() - hrstart;
console.log(hrend / 1000n, 'μs');
