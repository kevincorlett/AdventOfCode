const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'input.txt');
//appending a 0 to the end of the string makes it easier to process
const input = fs.readFileSync(filePath).toString() + '0';

//first expand the input to represent every byte on the disk
let disk = [];
for(let i=0; i<input.length; i+=2){
    const fileBytes = new Array(parseInt(input[i])).fill(i/2);
    disk.push(...fileBytes);

    const blankBytes = new Array(parseInt(input[i+1])).fill(null);
    disk.push(...blankBytes);
}

//now step through every byte taking from the end and filling the blanks
let j = disk.length;
for (let i=0;i<disk.length && i < j;i++){
    if (disk[i] === null){
        while (disk[--j] === null){
            //noop
        }

        disk[i] = disk[j];
        disk[j] = null;
    }
}

//now get the checksum
let result = disk.filter(x => x !== null).reduce((a, b, i) => a + i*b, 0);

console.log(result);
