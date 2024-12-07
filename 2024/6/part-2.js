const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'input.txt');
const input = fs.readFileSync(filePath).toString();

const EXITED = 'EXITED', LOOPING = 'LOOPING';
const mainGrid = input.split('\n').map(x => x.split(''));

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

let startCoords = null, startDirection = 0;
for (let row=0; startCoords === null && row<mainGrid.length; row++){
    for (let col=0; startCoords === null && col < mainGrid[0].length; col++){
        if (directions.hasOwnProperty(mainGrid[row][col])){
            startCoords = { row, col };
            startDirection = directions[mainGrid[row][col]];
        }
    }
}

//draw the path
const pathResult = followPath(mainGrid, startCoords, startDirection);

//for each step on the path, try putting a blocker in and see if we have a loop
let result = 0;
for(let v of pathResult.visited){
    const newGrid = copyGrid(mainGrid);

    const blockCoords = v[1].coords;

    newGrid[blockCoords.row][blockCoords.col] = '#';

    const newResult = followPath(newGrid, startCoords, startDirection);

    if (newResult.outcome === LOOPING){
        result++;
    }
}


console.log(result);

//returns a shallow copy of the grid
function copyGrid(grid){
    return grid.map(x => x.map(y => y));
}

//follow the path, and return a record of all visited locations, and the result of following the path
function followPath(grid, coords, direction){

    const visited = new Map();

    //helper function to record that the current coords have been visited, and in what direction of travel
    const storeVisited = () =>{
        const key = `${coords.row},${coords.col}`;
        let v = { coords, directions: [] };
        if (visited.has(key)){
            v = visited.get(key);
        } else {
            visited.set(key, v);
        }
        
        v.directions[direction] = true;

    }
    //helper function to check if the current coord has been visited in the current direction of travel
    const hasVisited = (testCoords, testDirection) => {
        const key = `${testCoords.row},${testCoords.col}`;
        
        return visited.has(key) && !!visited.get(key).directions[testDirection];
    }
    //helper function to create a result object
    const makeResult = (outcome) => {
        return { outcome, visited };
    }

    let turn = 0;
    while (turn < 4){
        const transform = transforms[direction];
        const nextCoords = {
            row: coords.row + (transform.y || 0),
            col: coords.col + (transform.x || 0)
        };
    
        if (nextCoords.row < 0 || nextCoords.row >= grid.length || nextCoords.col < 0 || nextCoords.col >= grid[0].length){
            break;
        }
    
        if (hasVisited(nextCoords, direction)){
            return makeResult(LOOPING);
        } else if (grid[nextCoords.row][nextCoords.col] === '#'){
            turn++;
            direction = (direction + 90) % 360;
        } else {
            turn = 0;
            coords = nextCoords;
            storeVisited();
        }
    }
    if (turn === 4){
        throw error('4 turns');
    }
    
    return makeResult(EXITED);
}