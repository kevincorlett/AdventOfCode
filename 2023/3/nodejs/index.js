const fs = require('fs');
const dot = '.'.charCodeAt(0), zero = '0'.charCodeAt(0), nine = '9'.charCodeAt(0), newLine = '\n'.charCodeAt(0);

const input = fs.readFileSync('input.txt');

const lineWidth = input.indexOf(newLine);

const isNumber = c => c >= zero && c <= nine;

const isSymbol = c => c != dot && c != newLine && !isNumber(c);

const containsSymbol = indexes => indexes.reduce((a, b) => a || (b > -1 && b < input.length && isSymbol(input[b])), false);

let result = 0;

for (let i = 0; i < input.length; i++) {
    if (isNumber(input[i])) {
        let symbolFound = containsSymbol([i - lineWidth - 2, i - 1, i + lineWidth]);

        let value = 0;
        do {
            value = 10 * value + input[i] - zero;
            symbolFound = symbolFound || containsSymbol([i - lineWidth - 1, i + lineWidth + 1]);
        } while (isNumber(input[++i]));

        symbolFound = symbolFound || containsSymbol([i - lineWidth - 1, i, i + lineWidth + 1]);

        if (symbolFound) {
            result += value;
        }
    }

}

console.log('Part 1:', result);

result = 0;


const gear = '*'.charCodeAt(0);

const isGearSymbol = c => c === gear;

const findGearSymbols = indexes => indexes.filter(i => i > -1 && i < input.length && isGearSymbol(input[i]));

const gears = {};


for (let i = 0; i < input.length; i++) {
    if (isNumber(input[i])) {
        const gearSymbols = findGearSymbols([i - lineWidth - 2, i - 1, i + lineWidth]);

        let value = 0;
        do {
            value = 10 * value + input[i] - zero;
            gearSymbols.push(...findGearSymbols([i - lineWidth - 1, i + lineWidth + 1]));
        } while (isNumber(input[++i]));

        gearSymbols.push(...findGearSymbols([i - lineWidth - 1, i, i + lineWidth + 1]));

        for (const s of gearSymbols){
            (gears[s] || (gears[s] = [])).push(value);
        }
    }
}

for(const idx in gears){
    if (gears[idx].length === 2){
        result += gears[idx][0] * gears[idx][1];
    }
}
console.log('Part 2:', result);
