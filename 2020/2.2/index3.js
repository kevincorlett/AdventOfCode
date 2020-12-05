function doit() {
    const file = require('fs').createReadStream('input.txt');
    let matchingPasswords = 0;
    const data = [];
    file.on('readable', () => {
        for (let buf = file.read(); buf; buf = file.read()) {
            data.push(...buf);
        }
    });

    file.on("end", () => {
        const hrstart = process.hrtime.bigint();
        let stage = 0; //0 = pos1, 1=pos2, 2=char, 3=pwd
        let pos1 = 0, pos2 = 0, char = 0, pwd = [];

        for (let i = 0; i < data.length; i++) {
            //reading the first position
            if (stage === 0) {
                if (data[i] === 0x2D) {
                    stage = 1;
                }
                else {
                    pos1 = (pos1 * 10) + data[i] - 0x30;
                }
                continue;
            }

            //reading the second position
            if (stage === 1) {
                if (data[i] === 0x20) {
                    stage = 2;
                } else {
                    pos2 = (pos2 * 10) + data[i] - 0x30;
                }
                continue;
            }

            //reading the char
            if (stage === 2) {

                char = data[i];

                i += 2; //discard the next 2 bytes

                stage = 3;
                continue;
            }

            //reading the password
            if (stage === 3) {
                if (data[i] === 0x0A) {
                    //eol - validate the password
                    if (pwd[pos1 - 1] === char ? pwd[pos2 - 1] !== char : pwd[pos2 - 1] === char) {
                        matchingPasswords++;
                    }

                    //reset
                    pos1 = 0;
                    pos2 = 0;
                    char = 0;
                    pwd = [];
                    stage = 0;
                    continue;
                }

                pwd.push(data[i]);
                continue;
            }

        }

        const hrend = process.hrtime.bigint() - hrstart;
        console.log(`There are ${matchingPasswords} matching passwords`);
        console.log(hrend / 1000n, 'us');
    });

}
doit();
doit();
doit();
doit();
doit();
doit();
doit();
doit();