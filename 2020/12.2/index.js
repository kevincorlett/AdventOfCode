const { timeLog } = require('console');
const fs = require('fs');

const hrstart = process.hrtime.bigint();
const data = fs.readFileSync("./input.txt").toString();
const hrload = process.hrtime.bigint();

const directions = data.split('\n').map(x => ({ cmd: x[0], value: parseInt(x.substring(1)) }));

const hrParse = process.hrtime.bigint();

const loc = { ew: 0, ns: 0 };
let wp = { ew: 10, ns: 1 };

const action = {
    N: x => wp.ns += x,
    E: x => wp.ew += x,
    S: x => wp.ns -= x,
    W: x => wp.ew -= x,
    F: x => {
        loc.ns += x * wp.ns;
        loc.ew += x * wp.ew;
    },
    R: {
        0: () => 0,
        90: () => wp = { ns: -wp.ew, ew: wp.ns },
        180: () => wp = { ns: -wp.ns, ew: -wp.ew},
        270: () => wp = { ns: wp.ew, ew: -wp.ns}
    },
    L: {
        0: () => 0,
        90: () => action.R[270](),
        180: () => action.R[180](),
        270: () => action.R[90]()
    }
};

for (let i = 0; i < directions.length; i++) {
    switch (directions[i].cmd) {
        case 'L':
        case 'R':
            action[directions[i].cmd][directions[i].value]();
            break;

        case 'F':
        case 'N':
        case 'E':
        case 'S':
        case 'W':
            action[directions[i].cmd](directions[i].value);
    }
}

const result = Math.abs(loc.ew) + Math.abs(loc.ns);

const hrProcess = process.hrtime.bigint();

console.log("result =", result);

console.log("Load\t\t", (hrload - hrstart) / 1000n, "μs")
console.log("Parse\t\t", (hrParse - hrload) / 1000n, "μs");
console.log("Process\t\t", (hrProcess - hrParse) / 1000n, "μs");
console.log("Total\t\t", (hrProcess - hrstart) / 1000n, "μs");

