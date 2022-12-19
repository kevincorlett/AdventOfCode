const input = require('fs').readFileSync('input.txt').toString();

const inputLines = input.split('\n');
let cycle = 0; // current cycle of the CRT
let position = 1; // start position of the sprite
let offset = 0; //offset between cycle and position

for (let i = 0; i < inputLines.length; i++) {

    const cmd = inputLines[i].split(' ');
    
    //first cycle
    drawPixel();

    //noop only lasts 1 cycle and doesn't move the sprite
    if (cmd[0] === 'noop') continue;
    
    //second cycle
    drawPixel();

    //move the sprite
    position += parseInt(cmd[1]);

}

function drawPixel(){
    if (cycle - offset > position - 2 && cycle - offset< position + 2) {
        process.stdout.write('#')
    } else {
        process.stdout.write('.')
    }

    if (++cycle % 40 === 0) {
        process.stdout.write('\n');
        offset += 40;
    }
}
