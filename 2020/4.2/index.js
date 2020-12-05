const fs = require('fs');
const hrstart = process.hrtime.bigint();

const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
const validators = {
    byr: x => /^\d{4}$/.test(x) && parseInt(x) > 1919 && parseInt(x) < 2003,
    iyr: x => /^\d{4}$/.test(x) && parseInt(x) > 2009 && parseInt(x) < 2021,
    eyr: x => /^\d{4}$/.test(x) && parseInt(x) > 2019 && parseInt(x) < 2031,
    hgt: x => {
        const match = x.match(/^(\d{2,3})(cm|in)$/);
        if (!match) return false;
        const val = parseInt(match[1]);
        const unit = match[2];

        return (unit === 'cm' && val > 149 && val < 194) || (unit === 'in' && val > 58 && val < 77);
    },
    hcl: x => /^#[0-9a-f]{6}$/.test(x),
    ecl: x => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(x),
    pid: x => /^\d{9}$/.test(x),
    cid: x => true
}

const data = fs.readFileSync("./input.txt").toString();

const psps = data.split('\n\n');

const goodPsps = psps.filter(p => {
    const fields = Array.from(RegExp.prototype[Symbol.matchAll].call(/(\w{3}):(\S+)/gm, p));
    const fieldNames = {};
    const fieldsValid = fields.every(f => fieldNames[f[1]] = validators[f[1]] && validators[f[1]](f[2]));

    return fieldsValid && requiredFields.every(rf => fieldNames[rf]);
});

console.log(`There are ${goodPsps.length} valid passports`);
const hrend = process.hrtime.bigint() - hrstart;
console.log(hrend / 1000n, 'μs');
