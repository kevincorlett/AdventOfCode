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
    const slopes = [
     { x: 1, y: 1},
        { x: 3, y: 1},
        { x: 5, y: 1},
        { x: 7, y: 1},
        { x: 1, y: 2},
    ];
    const strikes = slopes.map(s => howManyTrees(lines,s.x,s.y));
    const multiStrikes = strikes.reduce((a,b) => a * b);

    console.log(multiStrikes);
    const hrend = process.hrtime.bigint() - hrstart;
    console.log(hrend / 1000n, 'μs');

});

function howManyTrees(lines,incX, incY){
    let y = 0, x = 0;
    let trees = 0;

    while (y < lines.length-1){
        x = (x + incX) % lines[y].length;
        y += incY;

        if (lines[y][x] === '#')
            trees++;

    }

    return trees;
}