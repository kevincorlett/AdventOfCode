const hrstart = process.hrtime.bigint();
const readline = require('readline');

const fs = require('fs');
const readInterface = readline.createInterface({
    input: fs.createReadStream('input.txt'),
    output: process.stdout,
    console: false
});

const _values = {};

readInterface.on('line', function (line) {
    const value = parseInt(line);


    const diff = 2020 - value;
    if (_values[diff]) {

        console.log(`${value}*${diff}=${value * diff}`);
        const hrend = process.hrtime.bigint() - hrstart;
        console.log(`${hrend / 1000000n} ms`);
        process.exit();
    }

    _values[value] = true;
});
