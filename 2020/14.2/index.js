const fs = require('fs');

const hrstart = process.hrtime.bigint();
const input = fs.readFileSync("./input.txt");
const hrload = process.hrtime.bigint();

const lines = input.toString().split('\n');


const hrParse = process.hrtime.bigint();
let masks = [];
let values = {};
for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split(' = ');
    if (parts[0] === 'mask') {
        masks = [{ or: 0n, and: 0n }];
        for (let j = 0; j < parts[1].length; j++) {
            for (let k = 0; k < masks.length; k++) {
                masks[k].or <<= 1n;
                masks[k].and <<= 1n;
            }

            switch (parts[1][j]) {
                case '0':
                    masks.forEach((x, k) => masks[k].and |= 1n);
                    break;

                case '1':
                    masks.forEach((x, k) => masks[k].or |= 1n);
                    break;

                case 'X':
                    masks.push(...masks.map(x => ({ or: x.or, and: x.and })));
                    for (let k = masks.length / 2; k < masks.length; k++) {
                        masks[k].or |= 1n;
                    }
                    break;

            }
        }
        continue;
    }

    const index = BigInt(parts[0].match(/\[(\d+)\]/)[1]);
    const value = BigInt(parts[1]);
    for (let j = 0; j < masks.length; j++) {
        const maskedIndex = (index & masks[j].and) | masks[j].or;
        values[maskedIndex] = value;
    }

}

const result = Object.values(values).reduce((x, y) => x + y);

const hrProcess = process.hrtime.bigint();

console.log("result =", result);

console.log("Load\t\t", (hrload - hrstart) / 1000n, "μs")
console.log("Parse\t\t", (hrParse - hrload) / 1000n, "μs");
console.log("Process\t\t", (hrProcess - hrParse) / 1000n, "μs");
console.log("Total\t\t", (hrProcess - hrstart) / 1000n, "μs");

