const input = require('fs').readFileSync('input.txt').toString();

const inputLines = input.split('\n');

let max = 0;
for(let i=1;i<inputLines.length-1;i++){
    for (let j=1; j<inputLines[i].length-1;j++){

        let up = 1, down = 1, left = 1, right = 1;

        while (up < i && inputLines[i - up][j] < inputLines[i][j]) up++;
        while (i + down < inputLines.length-1 && inputLines[i + down][j] < inputLines[i][j]) down++;
        while (left < j && inputLines[i][j - left] < inputLines[i][j]) left++;
        while (j + right < inputLines[i].length-1 && inputLines[i][j+right] < inputLines[i][j]) right++;
        
        const score = up * down * left * right;

        if (score > max)
            max = score;

    }
}

console.log('Part 2:', max);
