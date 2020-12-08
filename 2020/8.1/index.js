const fs = require('fs');

const hrstart = process.hrtime.bigint();
const data = fs.readFileSync("./input.txt").toString();
const hrload = process.hrtime.bigint();

const items = data.split('\n').map(x => ({ op: x.substring(0,3), value: parseInt(x.substring(4)), done: false }));
const hrParse = process.hrtime.bigint();

let i = 0, total = 0;
while (i < items.length) {
    if (items[i].done){
        break;
    }
    items[i].done = true;
    switch (items[i].op) {
        case 'acc':
            total += items[i].value;
            i++;
            break;
        case 'jmp':
            i += items[i].value;
            break;
        case 'nop':
            i++;
            break;
        default:
            throw ('Unrecognised op:',items[i].op);
    }
}
const hrProcess = process.hrtime.bigint();

console.log("acc =",total);

console.log("Load\t\t", (hrload-hrstart)/1000n, "μs")
console.log("Parse\t\t",(hrParse-hrload) / 1000n, "μs");
console.log("Process\t\t",(hrProcess-hrParse) / 1000n, "μs");
console.log("Total\t\t", (hrProcess-hrstart)/1000n, "μs");