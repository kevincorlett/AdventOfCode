const fs = require('fs');
const readline = require('readline');
const path = require('path');

// const gridHeight=7, gridWidth=11, inputFile='test.txt';
const gridHeight=103, gridWidth=101, inputFile='input.txt';

const filePath = path.resolve(__dirname, inputFile);
const input = fs.readFileSync(filePath).toString();

const robots = [...input.matchAll(/p=(\d+),(\d+)\sv=(-?\d+),(-?\d+)/g)]
    .map((x,i) => ({
        i,
        p: { x: parseInt(x[1]), y: parseInt(x[2])},
        v: { x: parseInt(x[3]), y: parseInt(x[4])} 
    }));


let it=6677;
setInterval(() => {
    const positions = robots.map(r => {

        let x = r.p.x + (r.v.x * it), y = r.p.y + (r.v.y * it);
        x = x % gridWidth;
        y = y % gridHeight;

        if (x < 0){
            x += gridWidth;
        }
        if (y < 0){
            y += gridHeight;
        }

        return { x, y };
    });
    render(it, positions);

    it-=101;
}, 1000)

function render(turn, positions){
    process.stdout.write(`Turn ${turn}\n`);
    const grid = [];
    for(let y=0;y<gridHeight;y++){
        const row = new Array(gridWidth).fill(0);
        grid.push(row);
    }

    for (const p of positions){
        grid[p.y][p.x]++;
    }

    const str = grid.map(row => {
        // return row.map(x => x === 0 ? '.' : x).join('');
        return row.map(x => x === 0 ? ' ' : '•').join('');
    }).join('\n');
    process.stdout.write(str);
    
    process.stdout.write(`\u001b[${grid.length}A`);
    process.stdout.write('\u001b[0G');

    
}