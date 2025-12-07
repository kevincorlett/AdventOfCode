const fs = require('fs');
const path = require('path');
const inputFile='input.txt';
const filePath = path.resolve(__dirname, inputFile);
const input = fs.readFileSync(filePath).toString();
const lines = input.split('\r\n').map(x => x.split(''));

let result = 0;
const beams = [input.indexOf('S')];
const beamsAt = [];
beamsAt[beams[0]] = true;

for (let i=1; i<lines.length; i++){

    for (let j=0;j<beams.length;j++){
        const beamIdx = beams[j];
        if (lines[i][beamIdx] === '^'){
            result++;
            beamsAt[beamIdx] = false;
            beams.splice(j,1);
            j--;
            if (!beamsAt[beamIdx-1]){
                beamsAt[beamIdx-1] = true;
                beams.push(beamIdx-1);
            }
            if (!beamsAt[beamIdx+1]){
                beamsAt[beamIdx+1] = true;
                beams.push(beamIdx+1);
            }
        }
    }
}

console.log(result);