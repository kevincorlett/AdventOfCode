const input = require('fs').readFileSync('input.txt').toString();

const inputLines = input.split('\n');
let headX = 0, headY = 0, tailX = 0, tailY = 0;

const headMoves = { 
    R: [1,0],
    L: [-1,0],
    U: [0,1],
    D: [0,-1]
};
const tailPositions = {};

for (let x of inputLines) {
    const move = x.split(' ');
    const direction = move[0];
    const distance = parseInt(move[1]);
    const xy = headMoves[direction]
    for (let i=0;i<distance;i++){
        moveHead(xy[0], xy[1]);
    }
}

function moveHead(x, y){
    headX += x;
    headY += y;

    const diffX = headX - tailX;
    const diffY = headY - tailY;

    if (diffY == 0){
        if (diffX < -1) tailX--;
        if (diffX > 1) tailX++;
    }
    else if (diffX == 0){
        if (diffY < -1) tailY--;
        if (diffY > 1) tailY++;
    }
    else if (Math.abs(diffX) > Math.abs(diffY)){
        if (diffX < -1) tailX--;
        if (diffX > 1) tailX++;
        tailY = headY;
    }
    else if (Math.abs(diffX) < Math.abs(diffY)){
        if (diffY < -1) tailY--;
        if (diffY > 1) tailY++;
        tailX = headX;
    }
    else {
        //noop
    }

    tailPositions[`${tailX}:${tailY}`] = true;

}

console.log('Part 1:', Object.keys(tailPositions).length);

