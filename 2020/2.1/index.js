const hrstart = process.hrtime.bigint();

const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

let _matchingPasswords = 0;

readInterface.on('line', line => {
    const matches = line.match(/^(\d+)\-(\d+)\s(\w):\s(\w+)$/);

    const min = parseInt(matches[1]);
    const max = parseInt(matches[2]);
    const char = matches[3][0];
    const pwd = matches[4];

    //length of pwd < max skip
    if (pwd.length < max) {
        return;
    }

    let count = 0;
    for (let i = 0; i < pwd.length && count <= max; i++) {
        if (pwd[i] === char) {
            count++;
        }
    }

    if (count >= min && count <= max) {
        _matchingPasswords++;
    }
});

readInterface.on("close", () => {
    console.log(`There are ${_matchingPasswords} matching passwords`);
    const hrend = process.hrtime.bigint() - hrstart;
    console.log(hrend / 1000000n, 'ms');
});