const fs = require('fs');
const cp = require('node:child_process');

const inputFile = 'input.txt';
const input = fs.readFileSync(inputFile);
const inputLines = input.toString().split('\n');


const mappers = [];

for (let i = 2; i < inputLines.length; i++) {

    const mapNameMatches = [...inputLines[i].matchAll(/([^\-]+)-to-([^\-]+)\smap:/g)];

    const mapper = {
        from: mapNameMatches[0][1],
        to: mapNameMatches[0][2],
    };
    if (mappers.length > 0) {
        mappers[mappers.length - 1].nextMapper = mapper;
    }
    mappers.push(mapper);

    const mapEntries = [];
    while (++i < inputLines.length && inputLines[i] !== '') {

        const mappings = inputLines[i].split(' ').map(x => parseInt(x));
        mappings.push(mappings[1] + mappings[2]); //end of the origin range
        mappings.push(mappings[0] - mappings[1]); //diff between origin and dest

        mapEntries.push(mappings);
    }

    mapper.map = x => {
        const m = mapEntries.find(y => x >= y[1] && x < y[3]);
        let mapped = x;
        if (m) {
            mapped += m[4];
        }
        if (mapper.nextMapper) {
            return mapper.nextMapper.map(mapped);
        }
        return mapped;
    }
}

const seedMatches = inputLines[0].matchAll(/(\d+)/g);
const seedMatchesInt = [...seedMatches].map(x => parseInt(x[0]));

Promise.all(seedMatchesInt.map(x => mapRange(x, 1)))
    .then(results => {
        const result = results
            .reduce((a, b) => (a < b) ? a : b);

        console.log('Part 1:', result);
    })
    .then(() => {
        const promises = [];
        for(let i=0;i<seedMatchesInt.length;i+=2){
            promises.push(mapRange(seedMatchesInt[i], seedMatchesInt[i+1]));
        }
        return Promise.all(promises);
    })
    .then(results => {
        const result = results
            .reduce((a, b) => (a < b) ? a : b);

        console.log('Part 2:', result);
    });

    //Encapsulates forking a child process to do the mapping.
    //Returns a promise that resolves with the result of the mapping
    function mapRange(seedStart, range){
        return new Promise((res, rej) => {
            const proc = cp.fork('map-range', [inputFile, `${seedStart}`, `${range}`], { stdio: 'pipe' });
            proc.stdout.on('data', data => {
                res(parseInt(data.toString()));
            });
        });
    }

