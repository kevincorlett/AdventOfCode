const fs = require('fs');

const input = fs.readFileSync('input.txt');
const inputLines = input.toString().split('\n');

const seedMatches = inputLines[0].matchAll(/(\d+)/g);
let unmapped = [...seedMatches].map(x => ({ seed: parseInt(x[0]) }));
let mapped = [];

for (let i=2;i<inputLines.length;i++){

    const mapNameMatches = [...inputLines[i].matchAll(/([^\-]+)-to-([^\-]+)\smap:/g)];

    const mapFrom = mapNameMatches[0][1];
    const mapTo = mapNameMatches[0][2];

    while (++i < inputLines.length && inputLines[i] !== ''){
        if (unmapped.length === 0){
            continue;
        }


        const mappings = inputLines[i].split(' ').map(x => parseInt(x));
        mappings.push(mappings[0] - mappings[1]);

        for(let j = unmapped.length-1; j > -1; j--){
            
            if (unmapped[j][mapFrom] >= mappings[1] && unmapped[j][mapFrom] < mappings[1] + mappings[2]){
                unmapped[j][mapTo] = unmapped[j][mapFrom] + mappings[3];
                mapped.push(unmapped[j]);
                unmapped.splice(j, 1);
            }
        }
    }

    for(const x of unmapped){
        x[mapTo] = x[mapFrom];
        mapped.push(x);
    }
    unmapped = mapped;
    mapped = [];

}
const lowestLocation = unmapped.reduce((a,b) => a.location < b.location ? a : b);
console.log('Part 1:', lowestLocation.location );



let result = 0;

console.log('Part 2:', result);
