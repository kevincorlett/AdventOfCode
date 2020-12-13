const fs = require('fs');

const hrstart = process.hrtime.bigint();
const data = fs.readFileSync("./input.txt").toString();
const hrload = process.hrtime.bigint();

const lines = data.split('\n');
const earliestTime = parseInt(lines[0]);
const buses = lines[1].split(',').filter(x => x !== 'x').map(x => parseInt(x));

const hrParse = process.hrtime.bigint();

let result = 0, minTime = 9999;
for(let i=0;i<buses.length;i++){
    let r = earliestTime % buses[i];
    if (r === 0){
        result = 0;
        break;
    }
    r = buses[i] - r;
    if (r < minTime){
        result = buses[i] * r;
        minTime = r;
    }
}
const hrProcess = process.hrtime.bigint();

console.log("result =", result);

console.log("Load\t\t", (hrload - hrstart) / 1000n, "μs")
console.log("Parse\t\t", (hrParse - hrload) / 1000n, "μs");
console.log("Process\t\t", (hrProcess - hrParse) / 1000n, "μs");
console.log("Total\t\t", (hrProcess - hrstart) / 1000n, "μs");

