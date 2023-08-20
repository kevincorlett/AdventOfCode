const input = require('fs').readFileSync('test.txt').toString();
const bm = require('./big-math');

const monkeys = input.split('\n\n').map(x => parseMonkeyStr(x));
// console.log(JSON.stringify(monkeys, null, 2));
// return;

let hrstart, hrend;
for (let i = 0; i < 1000; i++) {

    // process.stdout.write('\x0D');
    // process.stdout.write(`${i}`);

    hrstart = process.hrtime.bigint();

    for (let j = 0; j < monkeys.length; j++) {
        monkeys[j].count = bm.add(monkeys[j].count, bm.number(monkeys[j].items.length));
// console.log(monkeys[j].count);
        while (monkeys[j].items.length > 0) {

            const currentItem = monkeys[j].items.pop();
            // const currentItem = monkeys[j].items.splice(0,1)[0];

            let newValue = processOperation(currentItem, monkeys[j].operation);

            let throwTo = -1;
            if (bm.dividesBy(newValue, monkeys[j].test.divisibleBy)){
                throwTo = monkeys[j].test.ifTrueThrowTo;
            } else {
                throwTo = monkeys[j].test.ifFalseThrowTo;
            }
            monkeys[throwTo].items.push(newValue);
        }

    }
        hrend = process.hrtime.bigint();

        process.stdout.write(`\r${i} ${(hrend - hrstart)}          `);
}
process.stdout.write('\n');

const sorted = monkeys.sort((a, b) => bm.gte(b.count, a.count));
console.log(sorted.map(x => x.count));
console.log('Part 2:', bm.multiply(sorted[0].count, sorted[1].count));

function parseMonkeyStr(monkeyStr) {

    const id = parseInt(/(?<=Monkey\s)\d+(?=:)/m.exec(monkeyStr)[0]);
    const items = /(?<=Starting items:\s)[0-9, ]+/m.exec(monkeyStr)[0].split(', ').map(x => bm.number(parseInt(x)));
    const parsedOp = /(?<=Operation: new = )(old|\d+) ([\+\-\*\/]) (old|\d+)/m.exec(monkeyStr);
    const operation = { left: parsedOp[1], op: parsedOp[2], right: parsedOp[3] };
    if (operation.left !== 'old'){
        operation.left = bm.number(parseInt(operation.left));
    }
    if (operation.right !== 'old'){
        operation.right = bm.number(parseInt(operation.right));
    }
    const test = {
        divisibleBy: bm.number(parseInt((/(?<=Test: divisible by )\d+/m.exec(monkeyStr)[0]))),
        ifTrueThrowTo: parseInt(/(?<=If true: throw to monkey )\d+/m.exec(monkeyStr)[0]),
        ifFalseThrowTo: parseInt(/(?<=If false: throw to monkey )\d+/m.exec(monkeyStr)[0])
    };

    return { id, items, operation, test, count: bm.number(0) };
}

function processOperation(oldValue, operation) {
    //process.stdout.write(`\r${oldValue} ${operation.op} ${operation.right === 'old' ? oldValue : operation.right}`);
    // process.stdout.write(`\r${process.memoryUsage.rss()}               `);
    //hrstart = process.hrtime.bigint();


    const left = operation.left === 'old' ? oldValue : operation.left;
    const right = operation.right === 'old' ? oldValue : operation.right;

    let result = bm.number(0);
    switch (operation.op) {
        case '+': result = bm.add(left, right); break;
        case '-': result = bm.subtract(left, right); break;
        case '/': result = bm.divide(left, right).div; break;
        case '*': result = bm.multiply(left, right); break;
        default: throw new Error(`Failed to process operation ${operation.left} ${operation.op} ${operation.right} for value old=${oldValue}`);
    }

    // hrend = process.hrtime.bigint() - hrstart;

    //process.stdout.write(`\r${hrend}`);
    // console.log(`${left} ${operation.op} ${right} ${hrend}`);
    return result;

}