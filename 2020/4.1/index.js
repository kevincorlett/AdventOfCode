const fs = require('fs');

const hrstart = process.hrtime.bigint();

const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
const requiredRegexs = requiredFields.map(x => new RegExp(`${x}:\\S+`, 'm'));

const data = fs.readFileSync("./input.txt").toString();

const psps = data.split('\n\n');

const goodPsps = psps.filter(p => requiredRegexs.every(r => r.test(p)));

console.log(`There are ${goodPsps.length} valid passports`);
const hrend = process.hrtime.bigint() - hrstart;
console.log(hrend / 1000n, 'μs');
