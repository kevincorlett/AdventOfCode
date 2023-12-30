const fs = require('fs');

const input = fs.readFileSync('input.txt');
const inputLines = input.toString().split('\n');

const handType = { '5-of-a-kind': 6, '4-of-a-kind': 5, 'full-house': 4, '3-of-a-kind': 3, '2-pair': 2, '1-pair': 1, 'high-card': 0 };
const cardValues = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'].reduce((a, b, i) => { a[b] = i; return a; }, {});

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

entries.forEach((x,i) => x.ranking = i+1);

let result = entries.reduce((a,b) => a + (b.ranking*b.bid), 0);

console.log('Part 1:', result);

function getHandType(hand) {
    hand = hand.split('');
    const cardCounts = {};
    for (let i = 0; i < hand.length; i++) {
        if (cardCounts[hand[i]]) {
            cardCounts[hand[i]] += 1;
        } else {
            cardCounts[hand[i]] = 1;
        }
    }

    const cardCountValues = Object.values(cardCounts);
    if (cardCountValues.length === 1) {
        return '5-of-a-kind';
    }

    const quadrupleCards = cardCountValues.filter(x => x === 4);
    if (quadrupleCards.length === 1) {
        return '4-of-a-kind';
    }

    const tripleCards = cardCountValues.filter(x => x === 3);
    const doubleCards = cardCountValues.filter(x => x === 2);
    if (tripleCards.length === 1 && doubleCards.length === 1) {
        return 'full-house';
    }

    const singleCards = cardCountValues.filter(x => x === 1);
    if (tripleCards.length === 1 && singleCards.length === 2) {
        return '3-of-a-kind';
    }

    if (doubleCards.length === 2) {
        return '2-pair';
    }

    if (doubleCards.length === 1 && singleCards.length === 3) {
        return '1-pair';
    }

    return 'high-card';
}