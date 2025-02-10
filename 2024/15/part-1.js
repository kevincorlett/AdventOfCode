const fs = require('fs');
const path = require('path');

const moveDeltas = {
    '^': { row: -1, col: 0 },
    'v': { row: 1, col: 0 },
    '>': { row: 0, col: 1 },
    '<': { row: 0, col: -1 }
};

const filePath = path.resolve(__dirname, 'input.txt');
const input = fs.readFileSync(filePath).toString();

const inputParts = input.split('\n\n');
const map = inputParts[0].split('\n').map(x => x.split(''));
const mapWidth = map[0].length, mapHeight = map.length;
const moves = inputParts[1].replaceAll('\n', '').split('');

//find the robot
const location = { col: 0, row: 0 };
for(let col=0;col<mapWidth; col++){
    for (let row=0;row<mapHeight;row++){
        if (map[row][col] === '@'){
            location.col = col;
            location.row = row;
        }
    }
}

//iterate through the moves
for (const m of moves){
    const result = tryMove(map, location, moveDeltas[m]);
    if (result.moved){
        location.col = result.location.col;
        location.row = result.location.row;
    }
}

let result = 0;
for (let row=0;row<mapHeight;row++){
    for (let col=0;col<mapWidth;col++){
        if (map[row][col] === 'O'){
            result += (100*row) + col;
        }
    }
}
console.log(result);

function tryMove(map, location, move){
    const newLocation = {
        col: location.col + move.col,
        row: location.row + move.row
    };

    //if the move would go out of bounds, don't move
    if (!isInBounds(map, newLocation)){
        return { moved: false };
    }

    //if the move collides with a wall, don't move
    if (isAWall(map, newLocation)){
        return { moved: false };
    }

    //if the move hits a box, try to move the box
    if (isABox(map, newLocation)){
        const result = tryMove(map, newLocation, move);
        //the box could not be moved
        if (!result.moved){
            return { moved: false };
        }
    }

    //got this far, so we can move
    map[newLocation.row][newLocation.col] = map[location.row][location.col];
    map[location.row][location.col] = '.';

    return { moved: true, location: newLocation };
}

function isABox(map, location){
    return map[location.row][location.col] === 'O';
}

function isAWall(map, location){
    return map[location.row][location.col] === '#';
}

function isInBounds(map, location){
    return location.col > -1 && location.row > -1 && location.col < map[0].length && location.row < map.length;
}
