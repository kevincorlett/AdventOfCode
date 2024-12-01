const fs = require('fs');
const path = require('path');

const N = 'N', S = 'S', E = 'E', W = 'W';

//define the behaviour of the different pipe sections.
//e.g. for a straight vertical pipe, if I enter going N I will continue going N
const pipes = {
    '|': { N, S},
    '-': { E, W },
    'L': { S: E, W: N },
    'J': { E: N, S: W },
    '7': { N: W, E: S },
    'F': { N: E, W: S }
};
//start position is always a north-east corner
pipes.S = pipes.F;

//what are the x, y deltas when moving in a given direction
const moves = {
    N: {x: 0, y: -1},
    S: {x: 0, y: 1},
    E: {x: 1, y: 0},
    W: {x: -1, y: 0}
};

// const input = readFile('test-1.txt');
const input = readFile('input.txt');
const inputLines = input.toString().split('\n');

//find the x, y coords of the start point
const startIdx = input.indexOf('S');
const lineLength = inputLines[0].length + 1;
const startY = Math.floor(startIdx / lineLength);
const startX = startIdx % lineLength;

let result = 0;
//the initial state is that we've come into the start pipe going N
let currentState = {
    x: startX,
    y: startY,
    going: N
};

do{
    currentState = getNextState(inputLines, currentState);
    result++;
} while (currentState.x !== startX || currentState.y !== startY);

console.log('Part 1:', result/2);

function getNextState(grid, state){
    const pipeChar = grid[state.y][state.x]; //y is row, x is col

    const pipe = pipes[pipeChar];

    const newDirection = pipe[state.going];

    const newState = {
        x: state.x + moves[newDirection].x,
        y: state.y + moves[newDirection].y,
        going: newDirection
    };



    return newState;
}

function readFile(filename){
    const filePath = path.resolve(__dirname, filename);
    return fs.readFileSync(filePath);
}