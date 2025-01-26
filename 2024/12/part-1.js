const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'input.txt');

const input = fs.readFileSync(filePath).toString();
const grid = input.split('\n').map(x => x.split(''));
const gridHeight = grid.length, gridWidth = grid[0].length;

const groups = {};
const cells = grid.map(x => x.map(y => undefined));

function isInGrid(row,col){
    return row >= 0 && row < gridHeight && col >= 0 && col < gridWidth;   
}
const moves = [[-1,0],[0,1],[1,0],[0,-1]];
function mapGroup(row, col, groupId, char){

    if (cells[row][col] !== undefined){
        return cells[row][col].groupId === groupId;
    }

    if (groupId === undefined){
        char = grid[row][col];
        groupId = `${row},${col}`;
        groups[groupId] = [];
    }
    
    if (grid[row][col] !== char){
        return false;
    }

    const cell = { row, col, char, groupId, perimeter: 4 };

    groups[groupId].push(cell);
    cells[row][col] = cell;
    
    for(let m of moves){
        const nextRow = row + m[0], nextCol = col + m[1];
        if (!isInGrid(nextRow, nextCol)){
            continue;
        }

        const adjoining = mapGroup(row + m[0], col + m[1], groupId, char);
        if (adjoining){
            cell.perimeter--;
        }
    }

    return true;
}

for (let row=0; row<gridHeight; row++){
    for (let col=0; col<gridWidth; col++){
            mapGroup(row, col);
    }
}

const result = Object.values(groups).reduce((a, g) => a + (g.length * g.reduce((b,c) => b + c.perimeter, 0)), 0);

console.log(result);