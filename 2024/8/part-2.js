const fs = require('fs');
const path = require('path');
const utils = require('../../js-utils');

const filePath = path.resolve(__dirname, 'input.txt');
const input = fs.readFileSync(filePath).toString();
const grid = input.split('\n').map(x => x.split(''));
const gridWidth = grid[0].length, gridHeight = grid.length;
const isInGrid = (row, col) => row > -1 && row < gridHeight && col > -1 && col < gridWidth;

//This method only works if you expand your test area to be beyond the bounds of the grid.
//There's a better way, but can't be arsed to recode this now

const antinodes = {};
//for every cell in the grid, follow a straight line in each direction, looking for
//the same character repeated at the same interval.
for(let row=-gridHeight; row < gridHeight*2; row++){
    for (let col=-gridWidth; col < gridWidth*2; col++){
        
        for (let y=-row; y<gridHeight-row; y++){
            for(let x=-col; x<gridWidth-col; x++){
                if (x === 0 && y === 0){
                    continue;
                }
                
                for (
                    let i=1, testRow=row+y, testCol=col+x;
                    isInGrid(testRow, testCol);
                    i++, testRow = row + i*y, testCol = col + i*x
                ) {
                    if (grid[testRow][testCol] === '.'){
                        continue;
                    }

                    let nextRow = row + y*i*2, nextCol = col + x*i*2;
                    const isAntinode = isInGrid(nextRow, nextCol) && grid[testRow][testCol] === grid[nextRow][nextCol];
                    if (isAntinode){    
                        //since we have found an antinode, record this cell and all cells along the line
                        //with the antennae.  we must find the smallest interval between antinodes so we 
                        //don't miss any out
                        const hcf = utils.highestCommonFactor([x*i,y*i]);
                        const dx = x*i/hcf, dy=y*i/hcf;

                        //work back to find antinodes before the current cell
                        for (let anRow = row, anCol = col; isInGrid(anRow, anCol); anRow -= dy, anCol -= dx){
                            antinodes[`${anRow},${anCol}`] = true;
                        }

                        //and work forward to find the antinodes after the next cell
                        for (let anRow = row + dy, anCol = col + dx; isInGrid(anRow, anCol); anRow += dy, anCol += dx){
                            antinodes[`${anRow},${anCol}`] = true;
                        }
                    }
                }
            }
        }
    }
}

console.log(Object.keys(antinodes).length);
