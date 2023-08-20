const fs = require('fs');

const input = fs.readFileSync('./test.txt').toString();
const a_num = 'a'.charCodeAt(0);
const grid = [[]];


for (let i=0;i<input.length;i++){
    if (input[i] == '\n'){
        grid.push([]);
        continue;
    }

    const newItem = {
        letter: input[i],
        value: input[i] == 'S' ? a_num : input[i] == 'Z' ? a_num + 26 : input.charCodeAt(i),
        up: grid.length > 1 ? grid[grid.length-2][i % (grid[0].length+1)] : null,
        left: grid[grid.length-1].length > 0 ? grid[grid.length-1][grid[grid.length-1].length-1] : null,
        right: null,
        down: null
    };
    if (newItem.left != null) newItem.left.right = newItem;
    if (newItem.up != null) newItem.up.down = newItem;
    
    grid[grid.length-1].push(newItem);
}

for(let i=0;i<grid.length;i++){
    for (let j=0;j<grid[i].length;j++){
        const x = grid[i][j];
        console.log(`${i},${j}: ${x.letter} ${x.value} ${x.up ? x.up.letter : '-'} ${x.left ? x.left.letter : '-'} ${x.right ? x.right.letter : '-'} ${x.down ? x.down.letter : '-'}`);
    }
}
