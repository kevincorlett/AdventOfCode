const fs = require('fs');
const pipe = '|'.charCodeAt(0), colon = ':'.charCodeAt(0), space = ' '.charCodeAt(0);

const input = fs.readFileSync('input.txt');

let result = 0;

let i = 0;

while (i < input.length) {
    while (input[i++] !== colon) ;
    i++;
    
    const winners = {};
    do {
        (winners[input[i++]] || (winners[input[i - 1]] = {}))[input[i++]] = true;
    } while (input[++i] !== pipe);
    
    i += 2;
    
    let count = 0;
    do {
        if (winners[input[i]] && winners[input[i]][input[i + 1]]) {
            count++;
        }
        i += 2;
    } while (input[i++] === space);
    
    if (count > 0) {
        result += 1 << count-1;
    }
}
console.log('Part 1:', result);



result = 0, i = 0;

let card = 0, cards = [];

while (i < input.length) {
    
    if (cards.length === card){
        cards.push(1);
    } else {
        cards[card]+=1;
    }

    while (input[i++] !== colon) ;
    i++;

    const winners = {};
    do {
        (winners[input[i++]] || (winners[input[i - 1]] = {}))[input[i++]] = true;
    } while (input[++i] !== pipe);
    
    i += 2;

    let count = 0;
    do {
        if (winners[input[i]] && winners[input[i]][input[i + 1]]) {
            count++;
        }
        i += 2;
    } while (input[i++] === space);

    for (let j=0;j<count;j++){
        if (cards.length < card + j + 2){
            cards.push(cards[card]);
        } else {
            cards[card + j + 1] += cards[card];
        }
    }
    result += cards[card++];
}

console.log('Part 2:', result);
