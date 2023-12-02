

const isGamePossible = g =>
    (!g.red || g.red < 13) &&
    (!g.green || g.green < 14) &&
    (!g.blue || g.blue < 15);

const inputLines = require('fs').readFileSync('input.txt').toString().split('\n');

result = 0;
for (const x of inputLines) {
    const game = parseInt(x.match(/(?<=^Game\s)\d+(?=:)/));
    const samples = x.matchAll(/(\s(\d+)\s([^,;]+)([,;]?))/g);

    let handful = {};
    let gamePossible = true;
    for (const s of samples) {


        const count = parseInt(s[2]);
        const colour = s[3];
        const endOfGroup = s[4] === '' || s[4] === ';';

        handful[colour] = count;
        if (endOfGroup) {
            gamePossible = isGamePossible(handful);
            if (!gamePossible) {
                break;
            }
        }
    }
    if (gamePossible) {
        result += game;
    }

}
console.log('Part 1:', result);



result = 0;
for (const x of inputLines) {
    const samples = x.matchAll(/(\s(\d+)\s([^,;]+)([,;]?))/g);

    let maxCounts = {};
    for (const s of samples) {

        const count = parseInt(s[2]);
        const colour = s[3];
        const endOfGroup = s[4] === '' || s[4] === ';';

        if (maxCounts[colour] === undefined || maxCounts[colour] < count){
            maxCounts[colour] = count;
        }

    }
    const power = ['red','green','blue'].reduce((a,b) => a * (maxCounts[b] === undefined ? 0 : maxCounts[b]) , 1);

    result += power;
}
console.log('Part 2:', result);
