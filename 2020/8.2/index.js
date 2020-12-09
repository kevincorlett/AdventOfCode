const fs = require('fs');

const hrstart = process.hrtime.bigint();
const data = fs.readFileSync("./input.txt").toString();
const hrload = process.hrtime.bigint();

const items = data.split('\n').map(x => ({
    op: x.substring(0, 3),
    value: parseInt(x.substring(4)),
    done: 0,
    flipped: false
}));
const hrParse = process.hrtime.bigint();

const flippers = { jmp: 'nop', nop: 'jmp', acc: 'acc' };
const flip = (item) => {
    item.op = flippers[item.op];
    item.flipped = true;
}

let i = 0;
let total = 0;
let flipped = null;
let attempt = 1;
while (i < items.length) {
    if (items[i].done == attempt) {
        attempt++;
        i = 0;
        total = 0;
        flip(flipped);
        flipped = null;
        continue;
    }

    items[i].done = attempt;
    switch (items[i].op) {
        case 'acc':
            total += items[i].value;
            i++;
            break;
        case 'jmp':
            if (!flipped && !items[i].flipped) {
                flip(items[i]);
                flipped = items[i];
                items[i].done = 0;
            } else {
                i += items[i].value;
            }
            break;
        case 'nop':
            if (!flipped && !items[i].flipped) {
                flip(items[i]);
                flipped = items[i];
                items[i].done = 0;
            } else {
                i++;
            }
            break;
        default:
            throw ('Unrecognised op:', items[i].op);
    }
}
const hrProcess = process.hrtime.bigint();

console.log("\nacc =", total);

console.log("Load\t\t", (hrload - hrstart) / 1000n, "μs")
console.log("Parse\t\t", (hrParse - hrload) / 1000n, "μs");
console.log("Process\t\t", (hrProcess - hrParse) / 1000n, "μs");
console.log("Total\t\t", (hrProcess - hrstart) / 1000n, "μs");