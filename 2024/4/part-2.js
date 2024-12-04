const fs = require('fs');
const path = require('path');


function readFile(filename){
    const filePath = path.resolve(__dirname, filename);
    return fs.readFileSync(filePath).toString();
}

const input = readFile('input.txt');
const chars = input.split('\n').map(x => x.split(''));
const width = chars[0].length, height = chars.length;

const word = 'MAS';
const middle = Math.floor(word.length / 2);
const adjacents = [[-1,-1], [-1,1], [1, 1], [1, -1]];
let result = 0;
for (let x=1;x<width-1;x++){
    for(let y=1;y<height-1;y++){
        let found = true;
        for (let n = 0; found && n <= middle; n++){
            found = adjacents
                .filter(a => chars[y + n*a[0]][x + n*a[1]] === word[middle-n] && chars[y - n*a[0]][x - n*a[1]] === word[middle+n])
                .length > 1;
        }
        if (found){
            result++;
        }
    }
}
console.log(result);