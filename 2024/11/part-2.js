const exp = require('constants');
const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'input.txt');

const input = fs.readFileSync(filePath).toString();
const stones = input.split(' ').map(x => BigInt(x));

const numberOfBlinks = 75;

const powers = new Array(30).fill();
powers[0] = 1n;
for (let i=1;i<powers.length;i++){
    powers[i] = powers[i-1] * 10n;
}

function getLength(num) {
    for (let i=0;i<powers.length;i++) { 
        if (num < powers[i]) 
            return i; 
    }
    throw (`Number too long: ${num}`);
}

const resultMap = new Map();
function storeResult(stone, times, result){
    let values = [];
    if (resultMap.has(stone)){
        values = resultMap.get(stone);
    } else {
        resultMap.set(stone, values);
    } 
    values[times] = result;
}

function getResult(stone, times){
    if (!resultMap.has(stone)){
        return undefined;
    }
    return resultMap.get(stone)[times];
}

function blink(stone, times){
    
    if (times === 0){
        return 1;
    }

    let result = getResult(stone, times);
    if (result !== undefined){
        return result;
    }

    if (stone === 0n){
        result = blink(1n, times-1);
        storeResult(stone, times, result);
        return result;
    }

    let length = getLength(stone);
    if ((length & 1) === 0){

        const div = powers[length >> 1];

        result = blink(stone / div, times-1) + blink(stone % div, times-1);
        storeResult(stone, times, result);
        return result;
    }

    result = blink(stone * 2024n, times-1);
    storeResult(stone, blink, result);
    return result;
}


let result = 0;
for (let i=0; i<stones.length; i++){
    result += blink(stones[i], numberOfBlinks);
}

console.log(result);
