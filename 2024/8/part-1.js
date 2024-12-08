const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'input.txt');
const input = fs.readFileSync(filePath).toString();
const grid = input.split('\n').map(x => x.split(''));
const gridWidth = grid[0].length, gridHeight = grid.length;
const isOnMap = (row, col) => col > -1 && col < gridWidth && row > -1 && row < gridHeight;


let result = 0;

//for every cell in the grid, follow a straight line in each direction, looking for
//the same character repeated at the same interval.  Stop if you find one.
for(let row=0; row < gridHeight; row++){
    for (let col=0; col < gridWidth; col++){
        let isAntinode = false;
        for(let x=1-gridWidth; !isAntinode && x<gridWidth-1; x++){

            for (let y=1-gridHeight; !isAntinode && y<gridHeight-1; y++){
                if (x === 0 && y === 0){
                    continue;
                }

                for (
                    let i=1, testRow=row+y, testCol=col+x;
                    !isAntinode && isOnMap(testRow, testCol);
                    i++, testRow = row + i*y, testCol = col + i*x
                ) {

                    if (grid[testRow][testCol] === '.'){
                        continue;
                    }

                    let nextRow = row + y*i*2, nextCol = col + x*i*2;
                    isAntinode = isOnMap(nextRow, nextCol) && grid[testRow][testCol] === grid[nextRow][nextCol];
                }
                if (isAntinode){
                    result++;
                }
            }
        }
    }
}

console.log(result);
