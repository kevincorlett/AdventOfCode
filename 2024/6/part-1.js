const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'input.txt');
const input = fs.readFileSync(filePath).toString();
const grid = input.split('\n').map(x => x.split(''));

const directions = {
    '^': 0,
    '>': 90,
    'V': 180,
    '<': 270
};
const transforms = {
    0: { y: -1 },
    90: { x: 1 },
    180: { y: 1 },
    270: { x: -1 }
}

let coords = null, direction = 0;
for (let row=0; coords === null && row<grid.length; row++){
    for (let col=0; coords === null && col < grid[0].length; col++){
        if (directions.hasOwnProperty(grid[row][col])){
            coords = { row, col };
            direction = directions[grid[row][col]];
        }
    }
}

const visited = {};
visited[`${coords.row},${coords.col}`] = true;

let turn = 0;
while (turn < 4){
    const transform = transforms[direction];
    const nextCoords = {
        row: coords.row + (transform.y || 0),
        col: coords.col + (transform.x || 0)
    };

    if (nextCoords.row < 0 || nextCoords.row >= grid.length || nextCoords.col < 0 && nextCoords.col >= grid[0].length){
        break;
    }

    if (grid[nextCoords.row][nextCoords.col] === '#'){
        turn++;
        direction = (direction + 90) % 360;
    } else {
        turn = 0;
        coords = nextCoords;
        visited[`${coords.row},${coords.col}`] = true;
    }
}
if (turn === 4){
    throw error('4 turns');
}

const result = Object.keys(visited).length;

console.log(result);