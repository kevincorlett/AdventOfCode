const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'test.txt');

const input = fs.readFileSync(filePath).toString();
const grid = input.split('\n').map(x => x.split('').map(y => parseInt(y)));
const gridWidth = grid[0].length, gridHeight = grid.length;


let result = 0;
for(let row=0; row<gridHeight; row++){
    for (let col=0;col<gridWidth;col++){
        if (grid[row][col] === 0){
            followTrail(row,col);
        }
    }
}

function followTrail(row,col){
    if (grid[row][col] === 9){
        result++;
        return;
    }

    for (let move of [[-1,0], [0, -1], [1, 0], [0, 1]]){
        const newRow = row + move[0], newCol = col + move[1];
        if (newRow > -1 && newCol > -1 && newRow < gridHeight && newCol < gridWidth && grid[newRow][newCol] - grid[row][col] === 1){
            followTrail(newRow, newCol);
        }
    }
}

console.log(result);
