const fs = require('fs');

const input = fs.readFileSync('input.txt');
const inputLines = input.toString().split('\n');

const handType = { '5-of-a-kind': 6, '4-of-a-kind': 5, 'full-house': 4, '3-of-a-kind': 3, '2-pair': 2, '1-pair': 1, 'high-card': 0 };
const cardValues = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A'].reduce((a, b, i) => { a[b] = i; return a; }, {});

const entries = [];

for(let i=0;i<inputLines.length;i++){
    const entry = {};

    const parts = inputLines[i].split(' ');

    entry.hand = parts[0];
    entry.bid = parseInt(parts[1]);
    entry.handType = getHandType(entry.hand);
    entry.handTypeValue = handType[entry.handType];
    entry.cardValues = entry.hand.split('').map(x => cardValues[x]);

    entries.push(entry);
}

entries.sort((a,b) => {
    let cmp = a.handTypeValue - b.handTypeValue;
    for (let i = 0; cmp === 0 && i < a.cardValues.length && i < b.cardValues.length; i++){
        cmp = a.cardValues[i] - b.cardValues[i];
    }
    return cmp;
});

// console.log(entries);
let result = entries.reduce((a,b,i) => a + ((i+1)*b.bid), 0);

console.log('Part 2:', result);

function getHandType(hand) {
    const cardCounts = {};
    for (let i = 0; i < hand.length; i++) {
        if (cardCounts[hand[i]]) {
            cardCounts[hand[i]] += 1;
        } else {
            cardCounts[hand[i]] = 1;
        }
    }

    const jokerCount = cardCounts['J'];
    const cardCountValues = Object.values(cardCounts);
    const differentCards = cardCountValues.length;
    const quadrupleCards = cardCountValues.filter(x => x === 4).length;
    const tripleCards = cardCountValues.filter(x => x === 3).length;
    const doubleCards = cardCountValues.filter(x => x === 2).length;
    const singleCards = cardCountValues.filter(x => x === 1).length;

    if (differentCards === 1 || (jokerCount > 0 && differentCards === 2)) {
        return '5-of-a-kind';
    }

    if (quadrupleCards === 1 || (jokerCount === 1 && tripleCards === 1) || (jokerCount === 2 && doubleCards === 2) || jokerCount === 3) {
        return '4-of-a-kind';
    }

    if ((tripleCards === 1 && doubleCards === 1) || (jokerCount === 1 && doubleCards === 2)) {
        return 'full-house';
    }
    
    if (tripleCards === 1 && singleCards === 2 || (jokerCount === 1 && doubleCards === 1) || (jokerCount === 2 && singleCards === 3)) {
        return '3-of-a-kind';
    }

    if (doubleCards === 2) {
        return '2-pair';
    }

    if (doubleCards === 1 || (jokerCount === 1 && singleCards === 5)) {
        return '1-pair';
    }

    return 'high-card';
}