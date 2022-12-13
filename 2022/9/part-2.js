const input = require('fs').readFileSync('input.txt').toString();

const inputLines = input.split('\n');

const headMoves = { R: [1, 0], L: [-1, 0], U: [0, 1], D: [0, -1] };

const head = [0,0], tail = [0,0];
const knots = [head, [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], tail];

const tailPositions = { };

for (let x of inputLines) {
    
    const direction = x[0];
    const distance = parseInt(x.substring(2));
    const move = headMoves[direction];

    for (let i = 0; i < distance; i++) {
        head[0] += move[0];
        head[1] += move[1];
        for (let j=1; j < knots.length; j++){
            const newPosition = moveTail(knots[j-1], knots[j]);
            if (newPosition[0] === knots[j][0] && newPosition[1] === knots[j][1]){
                break;
            }
            knots[j][0] = newPosition[0];
            knots[j][1] = newPosition[1];
        }

        tailPositions[`${tail[0]}:${tail[1]}`] = true;
    }
}

console.log('Part 2:', Object.keys(tailPositions).length);

//for given head and tail positions, find the new position
//of the tail after moving it towards the head
function moveTail(headPosition, tailPosition) {
    const headX = headPosition[0];
    const headY = headPosition[1];
    let tailX = tailPosition[0];
    let tailY = tailPosition[1];

    const diffX = headX - tailX;
    const diffY = headY - tailY;

    if (diffY === 0) {
        if (diffX < -1) tailX--;
        if (diffX > 1) tailX++;
    }
    else if (diffX === 0) {
        if (diffY < -1) tailY--;
        if (diffY > 1) tailY++;
    }
    else if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < -1) tailX--;
        if (diffX > 1) tailX++;
        tailY = headY;
    }
    else if (Math.abs(diffX) < Math.abs(diffY)) {
        if (diffY < -1) tailY--;
        if (diffY > 1) tailY++;
        tailX = headX;
    }
    else {
        if (diffX < -1) tailX--;
        if (diffX > 1) tailX++;
        if (diffY < -1) tailY--;
        if (diffY > 1) tailY++;
    }

    return [tailX, tailY];

}


