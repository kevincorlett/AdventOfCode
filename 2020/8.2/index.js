const fs = require('fs');

const hrstart = process.hrtime.bigint();
const data = fs.readFileSync("./test.txt").toString();
const hrload = process.hrtime.bigint();

const items = data.split('\n').map(x => ({ op: x.substring(0, 3), value: parseInt(x.substring(4)), done: false }));
const hrParse = process.hrtime.bigint();

// find the last backward jump:
// 1) any item after this will take us to the end of the program
// 2) this is the last jmp that could possibly be switched to a nop
let lastBackJmpIndex;
for (let i = items.length - 1; i > -1; i--) {
    if (items[i].op == 'jmp' && items[i].value < 0) {
        lastBackJmpIndex = i;
        break;
    }
};
console.log(lastBackJmpIndex);

let i = 0;
let total = 0;
let switched = false;
while (i < items.length) {
    if (items[i].done) {
        console.log('bork');
        break;
    }
    items[i].done = true;
    switch (items[i].op) {
        case 'acc':
            total += items[i].value;
            i++;
            break;
        case 'jmp':
            if (i == lastBackJmpIndex && !switched) {
                switched = true;
                items[i].op = 'nop';
            } else {
                i += items[i].value;
            }
            break;
        case 'nop':
            if (i + items[i].value > lastBackJmpIndex) {
                switched = true;
                items[i].op = 'jmp';
            } else {
                i++;
                break;
            }
        default:
            throw ('Unrecognised op:', items[i].op);
    }
}
const hrProcess = process.hrtime.bigint();

console.log("acc =", total);

console.log("Load\t\t", (hrload - hrstart) / 1000n, "μs")
console.log("Parse\t\t", (hrParse - hrload) / 1000n, "μs");
console.log("Process\t\t", (hrProcess - hrParse) / 1000n, "μs");
console.log("Total\t\t", (hrProcess - hrstart) / 1000n, "μs");