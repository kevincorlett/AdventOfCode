const input = require('fs').readFileSync('input.txt').toString();

const monkeys = input.split('\n\n').map(x => parseMonkeyStr(x));

for (let i = 0; i < 10000; i++) {
    console.log(`Round ${i}:`);
    for (let j = 0; j < monkeys.length; j++) {
        console.log(`  Monkey ${j}:`);
        monkeys[j].count += BigInt(monkeys[j].items.length);
        
        while (monkeys[j].items.length > 0) {

            // const currentItem = monkeys[j].items.pop();
            const currentItem = monkeys[j].items.splice(0,1)[0];
            console.log(`    Monkey inspects an item with a worry level of ${currentItem}`);

            let newValue = processOperation(currentItem, monkeys[j].operation);
            // newValue = Math.floor(newValue/3);
            // console.log(`      Monkey gets bored with item.  Worry level is divided by 3 to ${newValue}`);

            let throwTo = -1;
            if (newValue % monkeys[j].test.divisibleBy === 0n) {
                console.log(`      Current worry level is divisible by ${monkeys[j].test.divisibleBy}`);
                throwTo = monkeys[j].test.ifTrueThrowTo;
            } else {
                console.log(`      Current worry level is not divisible by ${monkeys[j].test.divisibleBy}`);
                throwTo = monkeys[j].test.ifFalseThrowTo;
            }
            console.log(`      Item with worry level ${newValue} is thrown to monkey ${throwTo}`);
            monkeys[throwTo].items.push(newValue);
        }
    }
}

const sorted = monkeys.sort((a,b) => b.count > a.count ? 1 : b.count < a.count ? -1 : 0);
console.log(sorted.map(x => x.count));
console.log('Part 1:', sorted[0].count * sorted[1].count);

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
    const opWords = { '+': 'increases by', '-': 'decreases by', '*': 'is multiplied by', '/': 'is divided by'};
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

    console.log(`      Worry level ${opWords[operation.op]} ${operation.right === 'old' ? 'itself' : right} to ${result}`);
    if (operation.op === '+' && operation.right === '6'){ console.log(left, right, result - left);}

    return result;

}