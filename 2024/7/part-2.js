const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'input.txt');
const input = fs.readFileSync(filePath).toString();
const equations = input.split('\n').map(x => {
    x = x.replace(':', ''); //take out the colon
    const nums = x.split(' ').map(y => parseInt(y));
    return {
        result: nums[0],
        operands: nums.slice(1)
    }
});

const operators = {
    '+': (a,b) => a + b,
    '*': (a,b) => a * b,
    '||': (a,b) => parseInt(`${a}${b}`)
};

//helper function to build all possible combinations of operators long enough for the equation
const pathCache = {};
function buildPaths(pathLength){
    if (pathCache[pathLength]){
        return pathCache[pathLength];
    }

    const paths = [];

    build([]);

    function build(path){
        //if we've reached the end, store the path
        if (path.length === pathLength){
            paths.push(path);
            return;
        }

        //for each operator, duplicate the path, add another element
        for (let o of Object.keys(operators)){
            build([...path, o], pathLength);
        }
    }

    return pathCache[pathLength] = paths;
}


let result = 0;
for(let e of equations){
    const paths = buildPaths(e.operands.length-1);

    for(let p of paths){
        const pathResult = e.operands.reduce((a,b,i) => operators[p[i-1]](a,b));
        if (pathResult === e.result){
            result += e.result;
            break;
        }
    }
}

console.log(result);