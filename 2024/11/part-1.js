const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'input.txt');

const input = fs.readFileSync(filePath).toString();
const stones = input.split(' ');

function blink(){
    for (let i = stones.length-1; i > -1; i--){
        if (stones[i] === '0'){
            stones[i] = '1';
        } else if (stones[i].length % 2 === 0){
            const halfLength = stones[i].length/2;
            const newStone = `${parseInt(stones[i].substring(halfLength))}`;
            stones.splice(i+1,0, newStone);
            stones[i] = stones[i].substring(0, halfLength);
        } else {
            stones[i] = `${2024*parseInt(stones[i])}`;
        }
    }
}

for (let i=0;i<25;i++){
    blink();
}

console.log(stones.length);
