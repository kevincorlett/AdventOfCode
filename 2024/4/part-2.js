const fs = require('fs');
const path = require('path');


function readFile(filename){
    const filePath = path.resolve(__dirname, filename);
    return fs.readFileSync(filePath).toString();
}

const input = readFile('input.txt');
const chars = input.split('\n').map(x => x.split(''));
const width = chars[0].length, height = chars.length;

let result = 0;

const adjacents = [[-1,-1], [-1,1], [1, 1], [1, -1]];
for (let x=1;x<width-1;x++){
    for(let y=1;y<height-1;y++){
        if (chars[y][x] === 'A'){
            //found A, now look around for the X-MAS
            const found = adjacents
                            .filter(a => chars[y+a[0]][x+a[1]] === 'S' && chars[y-a[0]][x-a[1]] === 'M')
                            .length === 2;

            if (found){
                result++;
            }

        }
    }
}
console.log(result);