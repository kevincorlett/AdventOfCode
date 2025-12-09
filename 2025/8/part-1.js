const fs = require('fs');
const path = require('path');
const { EOL } = require('os');

const inputFile='input.txt';
const filePath = path.resolve(__dirname, inputFile);
const input = fs.readFileSync(filePath).toString();
const jboxes = input.split(EOL)
    .map(x => x.split(','))
    .map((x,i) => ({ idx: i, x: x[0], y: x[1], z: x[2], circuit: -1}));


const maxConnections = 1000;

const connections = [];

for (let i=0;i<jboxes.length;i++){
    for (let j=i+1; j<jboxes.length; j++){

        const dx = jboxes[i].x - jboxes[j].x, dy = jboxes[i].y - jboxes[j].y, dz = jboxes[i].z - jboxes[j].z;
        const distSq = (dx*dx) + (dy*dy) + (dz*dz);

        if (connections.length < maxConnections || connections[maxConnections-1].distSq > distSq){
            let k=connections.length;
            while (--k > -1 && connections[k].distSq > distSq){
                //noop
            }
            connections.splice(k+1, 0, { distSq, from: jboxes[i], to: jboxes[j]});
            if (connections.length > maxConnections){
                connections.pop();
            }
        }
    }
}

let circuit = 0;
for (let c of connections){
    if (c.from.circuit === -1 && c.to.circuit === -1){
        c.from.circuit = c.to.circuit = circuit++;
    }
    else if (c.from.circuit === -1 && c.to.circuit > -1){
        c.from.circuit = c.to.circuit;
    }
    else if (c.from.circuit > -1 && c.to.circuit === -1){
        c.to.circuit = c.from.circuit;
    }
    else if (c.from.circuit > -1 && c.to.circuit > -1 && c.from.circuit !== c.to.circuit){
        let a = c.from.circuit, b = c.to.circuit;
        for (let i=0;i<connections.length;i++){
            if (connections[i].from.circuit === a){
                connections[i].from.circuit = b;
            }
            if (connections[i].to.circuit === a){
                connections[i].to.circuit = b;
            }
        }
    }
}

const circuits = [];
for (let c of connections){
    if (!c.from.done){
        c.from.done = true;
        if (!circuits[c.from.circuit]){
            circuits[c.from.circuit] = [c.from.idx];
        } else {
            circuits[c.from.circuit].push(c.from.idx);
        }
    }
    if (!c.to.done){
        c.to.done = true;
        if (!circuits[c.to.circuit]){
            circuits[c.to.circuit] = [c.to.idx];
        } else {
            circuits[c.to.circuit].push(c.to.idx);
        }
    }
}
let result = circuits.map(x => x.length).sort((a,b) => b-a).slice(0,3).reduce((a,b) => a*b, 1);

console.log(result);