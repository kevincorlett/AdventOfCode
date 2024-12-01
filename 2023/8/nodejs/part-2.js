const fs = require('fs');

const input = fs.readFileSync('input.txt');
// const input = fs.readFileSync('test-2.txt');
const inputLines = input.toString().split('\n');

const route = inputLines[0];
console.log(route.length);

const map = {};
let locations = [];

for(let i=2; i<inputLines.length; i++){
    const here = inputLines[i].substring(0, 3);
    const left = inputLines[i].substring(7, 10);
    const right = inputLines[i].substring(12,15);

    map[here] = map[here] || parseMapItem(here);
    map[left] = map[left] || parseMapItem(left);
    map[right] = map[right] || parseMapItem(right);

    map[here].L = map[left];
    map[here].R = map[right];

    if (map[here].endsWith === 'A'){
        locations.push(map[here]);
    }
}

let counter = 0;

let i=-1;
const loops = [];
while (locations.reduce((a,b) => a || !b.endsWithZ, false)){
    if (++i >= route.length){
        i = 0;
    }

    locations = locations.map(x => x[route[i]]);

    for(let j = locations.length-1; j>-1;j--){
        if (locations[j].history[i]){
            //been here before at the same point in the route (found a loop)
            console.log(j, i, locations[j].history[i], counter);
            loops.push(counter - locations[j].history[i]);
            locations.splice(j, 1);
            continue;
        }
        locations[j].history[i] = counter;
    }

    counter++;

}
loops.push(counter);
console.log('Part 2:', LCM(loops));

function parseMapItem(here){
    return { here, endsWith: here[2], endsWithZ: here[2] === 'Z', history: [] };
}

//lowest common multiple algo stolen from interwebs
function LCM(arr) { 
    function gcd(a, b) { 
        if (b === 0) return a; 
        return gcd(b, a % b); 
    } 
    
    let res = arr[0]; 
    
    for (let i = 1; i < arr.length; i++) { 
        res = (res * arr[i]) / gcd(res, arr[i]); 
    } 
    
    return res; 
} 
