const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'input.txt');

const input = fs.readFileSync(filePath).toString();
const grid = input.split('\n').map(x => x.split('').map(y => parseInt(y)));
const gridWidth = grid[0].length, gridHeight = grid.length;


const trails = {};
let trailHead = null;
for(let row=0; row<gridHeight; row++){
    for (let col=0;col<gridWidth;col++){
        if (grid[row][col] === 0){
            trailHead = `${row},${col}`;
            trails[trailHead] = {};
            followTrail(row,col);
        }
    }
}

function followTrail(row,col){
    if (grid[row][col] === 9){
        trails[trailHead][`${row},${col}`] = true;
        return;
    }

    for (let move of [[-1,0], [0, -1], [1, 0], [0, 1]]){
        const newRow = row + move[0], newCol = col + move[1];
        if (newRow > -1 && newCol > -1 && newRow < gridHeight && newCol < gridWidth && grid[newRow][newCol] - grid[row][col] === 1){
            followTrail(newRow, newCol);
        }
    }
}


const result = Object.values(trails).reduce((a,b) => a + (b ? Object.keys(b).length : 0), 0);

console.log(result);
