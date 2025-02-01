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
            a: { x: BigInt(a[1]), y: BigInt(a[2]), id: 'a'},
            b: { x: BigInt(b[1]), y: BigInt(b[2]), id: 'b'},
            prize: { x: BigInt(prize[1]) + 10000000000000n, y: BigInt(prize[2]) + 10000000000000n} 
        };
    });
    
const cost = {a: 3n, b: 1n};

let result = 0n;
for (const game of games){
    const {a, b, prize} = game;
    
    //simultaneous equation
    const na = ((b.y * prize.x) - (b.x*prize.y))/((b.y*a.x) - (b.x*a.y));
    const nb = (prize.x - (na*a.x))/b.x;

    //invalid combos have fractional results, which BigInt truncates
    //validate the combo by checking for rounding errors
    if (prize.x === (na*a.x) + (nb*b.x) && prize.y === (na*a.y) + (nb*b.y)){
        result += (na*cost.a) + (nb*cost.b);
    }
   
}
console.log(result);