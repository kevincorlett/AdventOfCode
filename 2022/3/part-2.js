const priorities = {};
//A == 65 a == 97
for (let i = 0; i < 26; i++) {
    priorities[i + 97] = i + 1;
    priorities[i + 65] = i + 27;
}

const input = require('fs').readFileSync('input.txt');

let letters = {};
let group = 1;
let result = 0, commonLetter = 0;
for (let i=0;i<=input.length;i++){
    //eol
    if (i === input.length || input[i] === 10){

        if (++group > 3){
            group = 1;
            letters = {}
            result += priorities[commonLetter];
            commonLetter = 0;
        }
        continue;
    }

    const x = input[i];
    
    if (group === 1 || letters[x] === group-1){
        letters[x] = group;
        if (group== 3){
            commonLetter = x;
        }
    }    
}

console.log(result);