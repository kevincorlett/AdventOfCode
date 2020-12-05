const hrstart = process.hrtime.bigint();

const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({
    input: fs.createReadStream('input.txt')
});

const _values = [];

readInterface.on('line', function (line) {
    const value = parseInt(line);
    
    for (let i=0; i<_values.length-1; i++){
        for (let j = 1; j<_values.length; j++){
            if (value + _values[i] + _values[j] == 2020){
                console.log(`${value}*${_values[i]}*${_values[j]}=${value * _values[i]*_values[j]}`);
                const hrend = process.hrtime.bigint() - hrstart;
                console.log(hrend/1000000n, 'ms');
                process.exit();
            }
        }
    }

    _values.push(value);
});

