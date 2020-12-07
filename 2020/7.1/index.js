const fs = require('fs');
const data = fs.readFileSync("./test.txt").toString();

const hrstart = process.hrtime.bigint();

const allRules = {};

// const matches = data.match(/(\d+\s)?([a-z]+\s[a-z]+)\sbags?/gm);
const matches = data.match(/(\d+|[a-z]+ [a-z]+|\.)/gm);
let i = 0;
while (i < matches.length) {
    const container = matches[i];
    console.log(container);
    const rules = [];
    i += 2;

    if (matches[i] == "no other") {
        i++;
    }

    while (matches[i] != ".") {
        console.log(matches[i], matches[i + 1]);
        rules.push({
            number: parseInt(matches[i]),
            colour: matches[i + 1]
        });
        i += 2;
    }

    i++;

    allRules[container] = rules;
}

for(const r in allRules){
    console.log(r, allRules[r]);
}

const hrend = process.hrtime.bigint() - hrstart;

// console.log(`There are ${goodPsps.length} valid passports`);
console.log(hrend / 1000n, 'μs');
