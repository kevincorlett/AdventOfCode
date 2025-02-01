const fs = require('fs');
const path = require('path');

// const gridHeight=7, gridWidth=11, inputFile='test.txt';
const gridHeight=103, gridWidth=101, inputFile='input.txt';

const filePath = path.resolve(__dirname, inputFile);
const input = fs.readFileSync(filePath).toString();

const robots = [...input.matchAll(/p=(\d+),(\d+)\sv=(-?\d+),(-?\d+)/g)]
    .map((x,i) => ({
        i,
        p: { x: parseInt(x[1]), y: parseInt(x[2])},
        v: { x: parseInt(x[3]), y: parseInt(x[4])} 
    }));

const it=100;
const positions = robots.map(r => {

   let x = r.p.x + (r.v.x * it), y = r.p.y + (r.v.y * it);
    x = x % gridWidth;
    y = y % gridHeight;

    if (x < 0){
        x += gridWidth;
    }
    if (y < 0){
        y += gridHeight;
    }

    return { x, y };
});

const midX = Math.floor(gridWidth/2);
const midY = Math.floor(gridHeight/2);
const result = positions
    .reduce((v, p) => {
        //ignore robots at the mid-points
        if (p.x === midX || p.y === midY){
            return v;
        }

        if (p.x < midX && p.y < midY){
            v[0]++;
        }
        else if (p.x < midX) {
            v[1]++;
        } else if (p.y < midY){
            v[2]++;
        } else {
            v[3]++;
        }

        return v;
    }, [0,0,0,0])
    .reduce((q,v) => q*v);

console.log(result);