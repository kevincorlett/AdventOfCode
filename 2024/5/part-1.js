const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'input.txt');
const input = fs.readFileSync(filePath).toString().split('\n\n');

const rules = 
    input[0]
        .split('\n')
        .map(x => x.split('|'))
        .reduce((a, x) => {
            if (a[x[0]]){
                a[x[0]].push(x[1]);
            } else {
                a[x[0]] = [x[1]]
            }
            return a;
        }, {});

const updates = 
    input[1]
        .split('\n')
        .map(x => x.split(','));

let result = 0;

for (let u of updates){
    let orderedOK = true;
    for (let i=1; orderedOK && i<u.length; i++){
        for (let j=0; orderedOK && j<i; j++){
            orderedOK = !rules.hasOwnProperty(u[i]) || !rules[u[i]].includes(u[j])
        }
    }

    if (orderedOK){
        result += parseInt(u[Math.floor(u.length/2)]);
    }
}

console.log(result);