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

    const bagsInside = [];
    i += 2;

    if (matches[i] == "no other") {
        i++;
    }

    while (matches[i] != ".") {
        bagsInside.push({
            number: parseInt(matches[i]),
            bag: matches[i + 1]
        });
        i += 2;
    }

    i++;

    allBags[name] = { name, bagsInside };
}
const hrPass1 = process.hrtime.bigint();

//2nd pass - hook up the relationships
for (const r in allBags) {
    allBags[r].bagsInside = allBags[r].bagsInside.map(x => ({ number: x.number, bag: allBags[x.bag] }));
}
const hrPass2 = process.hrtime.bigint();

//3rd pass - dig for gold (subtract 1 since the gold bag is included in the result)
const hasGoldTotal = -1 + Object.values(allBags).reduce((x, y) => { return hasGold(y) ? x + 1 : x; }, 0);

function hasGold(bag) {
    return bag.hasOwnProperty('hasGold') ? bag.hasGold : (bag.hasGold = (bag == allBags[goldName] || bag.bagsInside.some(r => hasGold(r.bag))));
}
const hrPass3 = process.hrtime.bigint();

//4th pass - count the bags inside the shiny gold one
const bagsInside = countBagsInside(allBags[goldName]);

function countBagsInside(bag) {
    if (bag.hasOwnProperty('totalBagsInside')) {
        return bag.totalBagsInside;
    }

    return bag.totalBagsInside = bag.bagsInside.reduce((x, y) => x + (y.number * (1 + countBagsInside(y.bag))), 0);
}
const hrPass4 = process.hrtime.bigint();

console.log("Bags that contain a gold one:", hasGoldTotal);
console.log("Bags inside the gold bag:", bagsInside);
console.log("Parse\t\t",(hrPass1-hrstart) / 1000n, "μs");
console.log("Link\t\t",(hrPass2-hrPass1) / 1000n, "μs");
console.log("Dig for gold\t",(hrPass3-hrPass2) / 1000n, "μs");
console.log("Count the bags\t",(hrPass4-hrPass3) / 1000n, "μs");
