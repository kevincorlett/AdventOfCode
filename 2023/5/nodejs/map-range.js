const fs = require('fs');

const input = fs.readFileSync(process.argv[2]);
const inputLines = input.toString().split('\n');


const mappers = [];

for (let i=2;i<inputLines.length;i++){
    
    const mapNameMatches = [...inputLines[i].matchAll(/([^\-]+)-to-([^\-]+)\smap:/g)];
    
    const mapper = {
        from: mapNameMatches[0][1],
        to: mapNameMatches[0][2],
    };
    if (mappers.length > 0){
        mappers[mappers.length-1].nextMapper = mapper;
    }
    mappers.push(mapper);
    
    const mapEntries = [];
    while (++i < inputLines.length && inputLines[i] !== ''){
        
        const mappings = inputLines[i].split(' ').map(x => parseInt(x));
        mappings.push(mappings[1] + mappings[2]); //end of the origin range
        mappings.push(mappings[0] - mappings[1]); //diff between origin and dest
        
        mapEntries.push(mappings);
    }
    
    mapper.map = x => {
        const m = mapEntries.find(y => x >= y[1] && x < y[3]);
        let mapped = x;
        if (m){
            mapped += m[4];
        }
        if (mapper.nextMapper){
            return mapper.nextMapper.map(mapped);
        }
        return mapped;
    }
}

const start = parseInt(process.argv[3]);
const range = parseInt(process.argv[4]);
const end = start + range;
let result = -1;

for (let j=start;j<end;j++){
    const mapped = mappers[0].map(j);
    if (result === -1 || mapped < result){
        result = mapped;
    }
}


console.log(result);