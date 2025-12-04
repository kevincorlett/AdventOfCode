const fs = require('fs');
const path = require('path');
const inputFile='input.txt';
const filePath = path.resolve(__dirname, inputFile);
const input = fs.readFileSync(filePath).toString();

const lines = input.split('\n').map(x => x.split(''));
const maxCount = 4;

let result = 0, removed = 0;

do {
    removed = 0;
    for (let y=0; y< lines.length; y++){
        for (let x=0; x<lines[y].length; x++){
            if (lines[y][x] !== '@'){
                continue;
            }

            let count = 0;
            for (let dy=-1; dy<2 && count < maxCount; dy++){
                let checkY = y + dy;
                if (checkY < 0 || checkY >= lines.length){
                    continue;
                }

                for (let dx=-1; dx<2 && count < maxCount; dx++){
                    if (dy === 0 && dx === 0){
                        continue;
                    }

                    let checkX = x + dx;
                    if (checkX < 0 || checkX >= lines[y].length){
                        continue;
                    }

                    if (lines[checkY][checkX] === '@'){
                        count++;
                    }
                }

            }
            if (count < maxCount){
                lines[y][x] = '.'
                removed++;
            }
        }
    }
    result += removed
} while (removed > 0);

console.log(result);