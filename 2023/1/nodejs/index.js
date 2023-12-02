const zero = '0'.charCodeAt(0), nine = '9'.charCodeAt(0), newline = '\n'.charCodeAt(0);

const input = require('fs').readFileSync('input.txt');

let lower = 0, upper = 0, result = 0;
for (const x of input){
    if (x >= zero && x <= nine){
        if (lower === 0){
            lower = x;
        }
        upper = x;
    }

    if (x === newline){
        result += ((lower - zero)*10) + upper - zero;
        lower = upper = 0;
    };
}
result += ((lower - zero)*10) + upper - zero;

console.log('Part 1:', result);


const values = ['zero','one','two','three','four','five','six','seven','eight','nine'].reduce((a,b,i) => { a[b] = a[i] = i; return a; }, {});
const matcher = /(?=(\d{1}|one|two|three|four|five|six|seven|eight|nine|zero))/g;
const inputLines = require('fs').readFileSync('input.txt').toString().split('\n');

result = 0;
for(const x of inputLines){
    const matches = Array.from(x.matchAll(matcher), m => m[1]);
    
    lower = values[matches[0]];
    upper = values[matches[matches.length-1]];
    
    result += (lower*10) + upper;
}
console.log('Part 2:', result);
