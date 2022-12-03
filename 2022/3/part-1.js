const priorities = {};
//A == 65 a == 97
for (let i = 0; i < 26; i++) {
    priorities[i + 97] = i + 1;
    priorities[i + 65] = i + 27;
}

const input = require('fs').readFileSync('input.txt');

let result = 0;
let currentLine = [];
for (let i=0;i<=input.length;i++){
    currentLine.push(i < input.length ? input[i] : 10);

    if (currentLine[currentLine.length-1] === 10){
        currentLine.length -=1;
        const halfLength = currentLine.length/2;
        const left = currentLine.slice(0, halfLength).sort((x,y) => x-y);
        const right = currentLine.slice(halfLength).sort((x,y) => x-y);

        const dupes = {};
        let j = 0, k=0;
        while (j < left.length && k < right.length){
            if (left [j] < right[k]){
                j++;
            } else if (left[j] > right[k]){
                k++;
            } else {
                dupes[left[j]] = true;
                j++;
                k++;
            }
        }

        result += Object.keys(dupes).reduce((x,y) => x + priorities[y], 0);
        currentLine = [];
    }

}
console.log('Part 1:',result);

