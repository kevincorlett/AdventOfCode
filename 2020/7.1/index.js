const fs = require('fs');
const data = fs.readFileSync("./input.txt").toString();

const hrstart = process.hrtime.bigint();

const allBags = {};

const goldName = 'shiny gold';

//first pass - extract the data
const matches = data.match(/(\d+|[a-z]+ [a-z]+|\.)/gm);
let i = 0;
while (i < matches.length) {
    const name = matches[i];

    const rules = [];
    i += 2;

    if (matches[i] == "no other") {
        i++;
    }

    while (matches[i] != ".") {
        rules.push({
            number: parseInt(matches[i]),
            colour: matches[i + 1]
        });
        i += 2;
    }

    i++;

    allBags[name] = { name, rules };
}

//2nd pass - hook up the relationships
for (const r in allBags) {
    allBags[r].rules = allBags[r].rules.map(x => ({ number: x.number, colour: allBags[x.colour] }));
}

//3rd pass - dig for gold!
const hasGoldTotal = Object.values(allBags).reduce((x,y) => { return hasGold(y) ? x+1 : x; },0);

function hasGold(c) {
    return c.hasOwnProperty('hasGold') ? c.hasGold : (c.hasGold = (c == allBags[goldName] || c.rules.some(r => hasGold(r.colour))));
}

const hrend = process.hrtime.bigint() - hrstart;

//gold itself is included in the result
console.log("result",hasGoldTotal-1);
console.log(hrend / 1000n, 'μs');
