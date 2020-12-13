const fs = require('fs');

const hrstart = process.hrtime.bigint();
const data = fs.readFileSync("./test.txt").toString();
const hrload = process.hrtime.bigint();

const buses = data
    .split(',')
    .map((x, i) => ({ bus: parseInt(x), i }))
    .filter(x => !isNaN(x.bus))
    .sort((x, y) => y.bus - x.bus)
    .map((x, i, arr) => ({ bus: x.bus, i: x.i, diff: x.i - arr[0].i }));
console.log(buses);

const hrParse = process.hrtime.bigint();


let found = false;
let t = 0;
let results = [];
const sample = 5;
while (results.length < sample) {
    // process.stdout.write(`\r${t}`);

    t += buses[0].bus;
    for (let i = 1; i < buses.length; i++) {
        found = (t + buses[i].diff) % buses[i].bus === 0;

        if (!found)
            break;
    }

    if (found)
        results.push(t - buses[0].i);

}
console.log(JSON.stringify(results));


// const start=77, jump=14; //7,13 //start=(next-2)*first, jump=2*first // X=2
// const start=102, jump=119; //17,x,13 //start=(next-7)*first, jump=7*first // X=7
// const start=335, jump=134; //67,7 //start=(next-2)*first, jump=2*first // X=2
// const start=201, jump=268; //67,x,7 // start=(next-4*first, jump=4*first // X=4
// const start=30413, jump=35780; //1789,37 // start=(next-20)*first, jump=20*first // X=20
const start = -5367, jump = 71560; //1789,x,37 // start=(next-40)*first, jump=40*first // X=40

const temp = [];
let offset = 0;
for (i = 0; i < sample; i++) {
    const x = start + ((i + offset) * (start + jump));
    if (x < 0) {
        offset++;
        i--;
        continue;
    }
    temp.push(x);
}

console.log(JSON.stringify(temp));
result = t - buses[0].i;
const hrProcess = process.hrtime.bigint();

console.log("result =", result);

console.log("Load\t\t", (hrload - hrstart) / 1000n, "μs")
console.log("Parse\t\t", (hrParse - hrload) / 1000n, "μs");
console.log("Process\t\t", (hrProcess - hrParse) / 1000n, "μs");
console.log("Total\t\t", (hrProcess - hrstart) / 1000n, "μs");

