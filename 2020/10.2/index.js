const fs = require('fs');

const hrstart = process.hrtime.bigint();
const data = fs.readFileSync("./input.txt").toString();
const hrload = process.hrtime.bigint();

const numbers = data.split('\n').map(x => parseInt(x));
const hrParse = process.hrtime.bigint();

const sorted = [0, ...numbers.sort((a, b) => a - b)];
sorted.push(sorted[sorted.length - 1] + 3);
const routes = sorted.map(x => 0);
routes[routes.length-1] = 1;

for(let i=sorted.length-1;i>-1;i--){
    const n = sorted[i];
    let j=i;

    while (--j > -1 && n - sorted[j] < 4){
        routes[j] = routes[j] + routes[i];
    }
}

const hrProcess = process.hrtime.bigint();

console.log("result =", routes[0]);

console.log("Load\t\t", (hrload - hrstart) / 1000n, "μs")
console.log("Parse\t\t", (hrParse - hrload) / 1000n, "μs");
console.log("Process\t\t", (hrProcess - hrParse) / 1000n, "μs");
console.log("Total\t\t", (hrProcess - hrstart) / 1000n, "μs");