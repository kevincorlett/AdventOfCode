const { writer } = require('repl');

const input = require('fs').readFileSync('input.txt').toString();
const inputLines = input.split('\n');

//part 1
const stacks1 = getStacks();
const stacks2 = getStacks();

for (const m of input.matchAll(/^move\s(\d+)\sfrom\s(\d+)\sto\s(\d+)$/gm)) {
    const toMove = parseInt(m[1]);
    const from = parseInt(m[2]);
    const to = parseInt(m[3]);

    for (let i = 0; i < toMove; i++) {
        stacks1[to - 1].push(stacks1[from - 1].pop());
    }
    stacks2[to - 1].push(...stacks2[from - 1].splice(stacks2[from - 1].length - toMove))
}

writeResult('Part 1', stacks1);
writeResult('Part 2', stacks2);

function writeResult(title, stacks){
    process.stdout.write(title);
    process.stdout.write(': ');
    stacks.forEach(x => {
        process.stdout.write(x.length === 0 ? ' ' : x[x.length - 1]);
    });
    process.stdout.write('\n');
}

function getStacks() {
    const stacks = [];

    for (let i = 0; inputLines[i][1] !== '1'; i++) {
        for (let j = 0; j < inputLines[i].length; j += 4) {
            if (inputLines[i][j] !== ' ') {
                (stacks[j / 4] || (stacks[j / 4] = [])).push(inputLines[i][j + 1]);
            }
        }
    }
    stacks.forEach(x => x.reverse());

    return stacks;
}
