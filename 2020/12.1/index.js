const fs = require('fs');

const hrstart = process.hrtime.bigint();
const data = fs.readFileSync("./input.txt").toString();
const hrload = process.hrtime.bigint();

const directions = data.split('\n').map(x => ({ cmd: x[0], value: parseInt(x.substring(1)) }));

const hrParse = process.hrtime.bigint();

const compass = { 0: 'N', 90: 'E', 180: 'S', 270: 'W', N: 0, E: 90, S: 180, W: 270 };
function turn(start, by, direction) {
    let deg = compass[start];
    if (direction === 'L') {
        deg = deg - by;
    }
    else {
        deg = deg + by;
    }
    return compass[(360 + deg) % 360];
}

let ew = 0, ns = 0;
const move = {
    N: x => ns += x,
    E: x => ew += x,
    S: x => ns -= x,
    W: x => ew -= x
};

let facing = 'E';
for (let i = 0; i < directions.length; i++) {
    switch (directions[i].cmd) {
        case 'L':
        case 'R':
            facing = turn(facing, directions[i].value, directions[i].cmd);
            break;

        case 'F':
            move[facing](directions[i].value);
            break;

        case 'N':
        case 'E':
        case 'S':
        case 'W':
            move[directions[i].cmd](directions[i].value);
    }
}

const result = Math.abs(ew) + Math.abs(ns);

const hrProcess = process.hrtime.bigint();

console.log("result =", result);

console.log("Load\t\t", (hrload - hrstart) / 1000n, "μs")
console.log("Parse\t\t", (hrParse - hrload) / 1000n, "μs");
console.log("Process\t\t", (hrProcess - hrParse) / 1000n, "μs");
console.log("Total\t\t", (hrProcess - hrstart) / 1000n, "μs");

