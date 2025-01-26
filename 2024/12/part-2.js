const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'input.txt');

const input = fs.readFileSync(filePath).toString();
const grid = input.split('\n').map(x => x.split(''));
const gridHeight = grid.length, gridWidth = grid[0].length;

const groups = {};
const cells = grid.map(x => x.map(y => undefined));

const moves = [[0,1],[-1,0],[0,-1],[1,0]];

function isInGrid(row,col){
    return row >= 0 && row < gridHeight && col >= 0 && col < gridWidth;   
}

function getCell(row, col){
    if (!isInGrid(row,col)){
        return undefined;
    }

    return cells[row][col];
}

function isInGroup(row, col, groupId){
    const cell = getCell(row, col);
    return cell !== undefined && cell.groupId === groupId;
}

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

let result = 0;
//you can count the sides by counting the corners
//for each group, count the corners of every cell
const cornerChecks = [[0,-1],[-1,0],[0,1],[1,0],[0,-1]];
for (const g in groups){
    let corners = 0, innerCorners = 0, outerCorners = 0;
    for (const cell of groups[g]){
        for (let j = 0; j<cornerChecks.length-1; j++){
            //count the outer corners
            if (
                !isInGroup(cell.row + cornerChecks[j][0], cell.col + cornerChecks[j][1], cell.groupId) &&
                !isInGroup(cell.row + cornerChecks[j+1][0], cell.col + cornerChecks[j+1][1], cell.groupId)
            ){
                corners++;
                outerCorners++;
            }

            //count the inner corners
            if (
                isInGroup(cell.row + cornerChecks[j][0], cell.col + cornerChecks[j][1], cell.groupId) &&
                isInGroup(cell.row + cornerChecks[j+1][0], cell.col + cornerChecks[j+1][1], cell.groupId) &&
                !isInGroup(cell.row + cornerChecks[j][0] + cornerChecks[j+1][0], cell.col + cornerChecks[j][1] + cornerChecks[j+1][1], cell.groupId)
            ){
                corners++
                innerCorners++;
            }
        }
    }
    
    // console.log(`Group ${groups[g][0].groupId} has ${corners} corners - ${innerCorners} inner corners and ${outerCorners} outer corners`);

    result += corners * groups[g].length;
}

console.log(result);