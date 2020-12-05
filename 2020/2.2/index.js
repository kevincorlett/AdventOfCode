function doit() {
    let hrstart = 0;
    const readline = require('readline');
    const fs = require('fs');
    const readInterface = readline.createInterface({
        input: fs.createReadStream('input.txt')
    });
    let _matchingPasswords = 0;
    hrstart = process.hrtime.bigint();
    readInterface.on('line', line => {
        const matches = line.match(/^(\d+)\-(\d+)\s(\w):\s(\w+)$/);
        const min = parseInt(matches[1]);
        const max = parseInt(matches[2]);
        const char = matches[3][0];
        const pwd = matches[4];
        if (pwd.length < max) {
            return;
        }
        const isAtMin = pwd[min - 1] === char, isAtMax = pwd[max - 1] === char;
        if (isAtMin ? !isAtMax : isAtMax) {
            _matchingPasswords++;
        }
    });
    readInterface.on("close", () => {
        console.log(`There are ${_matchingPasswords} matching passwords`);
        const hrend = process.hrtime.bigint() - hrstart;
        console.log(hrend / 1000n, 'μs');

    });
}

doit();
doit();