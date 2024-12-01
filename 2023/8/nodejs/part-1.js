const fs = require('fs');

const input = fs.readFileSync('input.txt');
const inputLines = input.toString().split('\n');

const route = inputLines[0];

const map = {};

for(let i=2; i<inputLines.length; i++){
    const here = inputLines[i].substring(0, 3);
    const left = inputLines[i].substring(7, 10);
    const right = inputLines[i].substring(12,15);

    map[here] = map[here] || { here };
    map[left] = map[left] || { here: left };
    map[right] = map[right] || { here: right };

    map[here].L = map[left];
    map[here].R = map[right];

}

let result = 0;

let location = map['AAA'];
for (let i=0; location.here !== 'ZZZ'; i++){
    if (i >= route.length){
        i = 0;
    }

    location = location[route[i]];

    result++;
}

console.log('Part 1:', result);