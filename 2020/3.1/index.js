const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({
    input: fs.createReadStream('input.txt')
});
const hrstart = process.hrtime.bigint();
const lines = [];
readInterface.on('line', line => {
    lines.push(line);
});

readInterface.on("close", () => {
    const incY = 1, incX = 3;
    let y = 0, x = 0;
    let trees = 0;

    while (y < lines.length-1){
        x = (x + incX) % lines[y].length;
        y += incY;

        if (lines[y][x] === '#')
            trees++;

    }

    
    console.log(`There are ${trees} tree strikes!`);
    const hrend = process.hrtime.bigint() - hrstart;
    console.log(hrend / 1000n, 'μs');

});