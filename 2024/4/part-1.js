const fs = require('fs');
const path = require('path');


function readFile(filename){
    const filePath = path.resolve(__dirname, filename);
    return fs.readFileSync(filePath).toString();
}

const input = readFile('input.txt');
const chars = input.split('\n').map(x => x.split(''));
const width = chars[0].length, height = chars.length;

const word = 'XMAS'.split('');

let result = 0;
for (let x=0;x<width;x++){
    for(let y=0;y<height;y++){
        if (chars[y][x] === word[0]){
            //found a first letter.  now look in all directions for the rest of the letters
            for (let i=-1;i<2;i++){
                for (let j=-1;j<2;j++){
                    if (i === 0 && j === 0) continue;
        
                    const found = word.every((char, n) => {
                        const X = x + n*i, Y = y + n*j;
                        return X >= 0 && X < width && Y >= 0 && Y < height && chars[Y][X] === char;
                    });

                    if (found){
                        result++;
                    }
                }
            }
            
        }
    }
}
console.log(result);