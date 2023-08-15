const input = require('fs').readFileSync('test.txt').toString();

const monkeys = input.split('\n\n').map(x => parseMonkeyStr(x));
let hrstart, hrend;
for (let i = 0; i < 1000; i++) {

    // process.stdout.write('\x0D');
    // process.stdout.write(`${i}`);

    hrstart = process.hrtime.bigint();

    for (let j = 0; j < monkeys.length; j++) {
        monkeys[j].count += BigInt(monkeys[j].items.length);

        while (monkeys[j].items.length > 0) {

            const currentItem = monkeys[j].items.pop();
            // const currentItem = monkeys[j].items.splice(0,1)[0];

            let newValue = processOperation(currentItem, monkeys[j].operation);

            let throwTo = -1;
            if (newValue % monkeys[j].test.divisibleBy === 0n) {
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

const sorted = monkeys.sort((a, b) => b.count > a.count ? 1 : b.count < a.count ? -1 : 0);
console.log(sorted.map(x => x.count));
console.log('Part 2:', sorted[0].count * sorted[1].count);

function parseMonkeyStr(monkeyStr) {

    const id = parseInt(/(?<=Monkey\s)\d+(?=:)/m.exec(monkeyStr)[0]);
    const startingItems = /(?<=Starting items:\s)[0-9, ]+/m.exec(monkeyStr)[0].split(', ').map(x => BigInt(x));
    const parsedOp = /(?<=Operation: new = )(old|\d+) ([\+\-\*\/]) (old|\d+)/m.exec(monkeyStr);
    const operation = { left: parsedOp[1], op: parsedOp[2], right: parsedOp[3] };
    const test = {
        divisibleBy: BigInt(/(?<=Test: divisible by )\d+/m.exec(monkeyStr)[0]),
        ifTrueThrowTo: parseInt(/(?<=If true: throw to monkey )\d+/m.exec(monkeyStr)[0]),
        ifFalseThrowTo: parseInt(/(?<=If false: throw to monkey )\d+/m.exec(monkeyStr)[0])
    };

    return { id, items: startingItems, operation, test, count: 0n };
}

function processOperation(oldValue, operation) {
    //process.stdout.write(`\r${oldValue} ${operation.op} ${operation.right === 'old' ? oldValue : operation.right}`);
    // process.stdout.write(`\r${process.memoryUsage.rss()}               `);
    //hrstart = process.hrtime.bigint();


    const left = operation.left === 'old' ? oldValue : BigInt(operation.left);
    const right = operation.right === 'old' ? oldValue : BigInt(operation.right);

    let result = 0n;
    switch (operation.op) {
        case '+': result = left + right; break;
        case '-': result = left - right; break;
        case '/': result = left / right; break;
        case '*': result = left * right; break;
        default: throw new Error(`Failed to process operation ${operation.left} ${operation.op} ${operation.right} for value old=${oldValue}`);
    }

    // hrend = process.hrtime.bigint() - hrstart;

    //process.stdout.write(`\r${hrend}`);
    // console.log(`${left} ${operation.op} ${right} ${hrend}`);
    return result;

}