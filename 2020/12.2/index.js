const { timeLog } = require('console');
const fs = require('fs');

const hrstart = process.hrtime.bigint();
const data = fs.readFileSync("./input.txt").toString();
const hrload = process.hrtime.bigint();

const directions = data.split('\n').map(x => ({ cmd: x[0], value: parseInt(x.substring(1)) }));

const hrParse = process.hrtime.bigint();

const loc = { ew: 0, ns: 0 };
let wp = { ew: 10, ns: 1 };

const rotate = {
    R: {
        0: x => x,
        90: x => ({ ns: -x.ew, ew: x.ns }),
        180: x => ({ ns: -x.ns, ew: -x.ew}),
        270: x => ({ ns: x.ew, ew: -x.ns})
    },
    L: {
        0: x => x,
        90: x => rotate.R[270](x),
        180: x => rotate.R[180](x),
        270: x => rotate.R[90](x)
    }
};

const move = {
    N: x => wp.ns += x,
    E: x => wp.ew += x,
    S: x => wp.ns -= x,
    W: x => wp.ew -= x,
    F: x => {
        loc.ns += x * wp.ns;
        loc.ew += x * wp.ew;
    }
};

for (let i = 0; i < directions.length; i++) {
    switch (directions[i].cmd) {
        case 'L':
        case 'R':
            wp = rotate[directions[i].cmd][directions[i].value](wp);
            break;

        case 'F':
        case 'N':
        case 'E':
        case 'S':
        case 'W':
            move[directions[i].cmd](directions[i].value);
    }
}

const result = Math.abs(loc.ew) + Math.abs(loc.ns);

const hrProcess = process.hrtime.bigint();

console.log("result =", result);

console.log("Load\t\t", (hrload - hrstart) / 1000n, "μs")
console.log("Parse\t\t", (hrParse - hrload) / 1000n, "μs");
console.log("Process\t\t", (hrProcess - hrParse) / 1000n, "μs");
console.log("Total\t\t", (hrProcess - hrstart) / 1000n, "μs");

