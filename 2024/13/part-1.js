const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'input.txt');

const games = fs.readFileSync(filePath).toString()
    .split('\n\n')
    .map((x,i) => {
        const a = /Button A: X\+(\d+), Y\+(\d+)/.exec(x);
        const b = /Button B: X\+(\d+), Y\+(\d+)/.exec(x);
        const prize = /Prize: X=(\d+), Y=(\d+)/.exec(x);

        return {
            i,
            a: { x: parseInt(a[1]), y: parseInt(a[2]), id: 'a'},
            b: { x: parseInt(b[1]), y: parseInt(b[2]), id: 'b'},
            prize: { x: parseInt(prize[1]), y: parseInt(prize[2])} 
        };
    });
    
const cost = {a: 3, b: 1};

let result = 0;
for (const game of games){
    // console.log(game);
    const {a, b, prize} = game;
    
    const costPerMove = { a: cost.a / (a.x + a.y), b: cost.b / (b.x + b.y) }

    //make the 0th button the cheapest, and try to push that one the most
    const btns = costPerMove.a > costPerMove.b ? [b,a] : [a,b];

    //max. number of times the cheaper button can be pressed
    const pressX = prize.x / btns[0].x, pressY = prize.y / btns[0].y;
    let presses = pressX < pressY ? Math.floor(pressX) : Math.floor(pressY);
    if (presses > 100){
        presses = 100;
    }

    //work back from the max number of presses of the cheap button, to find a combo that works
    for(let i=presses; i > -1; i--){
        const dx = prize.x - (i*btns[0].x), dy = prize.y - (i*btns[0].y);

        const pressX = dx / btns[1].x, pressY = dy / btns[1].y;

        if (Number.isInteger(pressX) && pressX === pressY){
            const totalCost = (i*cost[btns[0].id]) + (pressX * cost[btns[1].id]);
            result += totalCost;
            console.log(`${game.i}: ${totalCost}`);
            break;
        }
    }
}
console.log(result);