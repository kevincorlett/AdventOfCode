const input = require('fs').readFileSync('input.txt');
const result = new Array(input.length).fill(0);

const makeState = r => ({r: 0, c: 0, visible: 0, climit: 0, rlimit: 0,  colMax: [], rowMax: 0, result: r});

//forward pass - check what's visible from left and top
const forwardState = makeState(result);
for (let i = 0; i<input.length;i++){
    findVisibleTrees(input[i], i, forwardState)
}

//reverse pass - check what's visible from right and bottom
const reverseState = makeState(result);
for (let i=input.length-1; i> -1; i--) {
    findVisibleTrees(input[i], i, reverseState);
}

console.log('Part 1:', result.reduce((x,y) => x+y));

function findVisibleTrees(x, i, s){
    
    //newline
    if (x === 10){
        //find the size of the box
        if (s.climit === 0){
            s.climit = s.c;
            s.rlimit = (s.result.length+1) / (s.climit+1);
        }
        //move to next row
        s.r++;
        //move to first column
        s.c = 0;
        //reset the biggest tree on the row
        s.rowMax = 0;
        return;
    }
    
    //top edge is always visible
    if (s.r === 0){
        s.result[i] = 1;
        
        //by default the top row is the biggest tree so far in every column
        s.colMax[s.c] = x;
    }
    
    //left edge is always visible
    else if (s.c === 0){
        s.result[i] = 1;
        
        //by default the left edge is the biggest tree so far in every row
        s.rowMax = x;
    }
    
    //bottom edge is always visible
    else if (s.r === s.rlimit - 1){
        s.result[i] = 1;
    }
    
    //right edge is always visible
    else if (s.c === s.climit - 1){
        s.result[i] = 1;
    }
    
    //current is bigger than previous max on row so is visible from the left
    else if (x > s.rowMax){
        s.result[i] = 1;
        s.rowMax = x;
        
        //check if it's also bigger than others in the column
        if (x > s.colMax[s.c]){
            s.colMax[s.c] = x;
        }
    }
    
    //current tree is bigger than previous max on col so is visible from the bottom
    else if (x > s.colMax[s.c]){
        s.result[i] = 1;
        s.colMax[s.c] = x;
    }
    
    //increment the column
    s.c++;
}
