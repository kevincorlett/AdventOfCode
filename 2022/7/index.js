const input = require('fs').readFileSync('input.txt').toString();
const inputLines = input.split('\n');

//part 1
const root = { parent: null, size: 0, path: '/', children: {}, isDir: true};
let currentDir = { children: { '/': root } };

for(let i=0;i<inputLines.length;i++){
    const cmd = inputLines[i].split(' ');
    if (cmd[1] === 'cd'){
        if (cmd[2] === '..'){
            currentDir = currentDir.parent;
        } else {
            currentDir = currentDir.children[cmd[2]];
        }
    }

    if (cmd[1] === 'ls'){
        while (++i < inputLines.length && inputLines[i][0] !== '$'){
            const entry = inputLines[i].split(' ');
            currentDir.children[entry[1]] = {
                parent: currentDir, 
                size: entry[0] === 'dir' ? 0 : parseInt(entry[0]),
                path: `${currentDir.path}/${entry[1]}`,
                children: {},
                isDir: entry[0] === 'dir'
        };
        }
        i--;
    }
}

let result = 0;
const sizes = {};

calculateSizes(root, sizes);

function calculateSizes(dir, sizes){
    dir.size = 0;
    for(let x in dir.children){
        if (dir.children[x].isDir){
            dir.size += calculateSizes(dir.children[x], sizes);
        } else {
            dir.size += dir.children[x].size;
        }
    }
    
    sizes[dir.path] = dir.size;
    if (dir.size <= 100000) result += dir.size;
    return dir.size;
}

console.log('Part 1:', result);

//part 2
const diskSize = 70000000;
const requiredSpace = 30000000;
const minToClear = requiredSpace + root.size - diskSize;

console.log('Part 2:', Object.values(sizes).sort((x,y) => x-y).find(x => x > minToClear));