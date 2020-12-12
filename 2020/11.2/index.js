const fs = require('fs');

const hrstart = process.hrtime.bigint();
const data = fs.readFileSync("./input.txt");
const hrload = process.hrtime.bigint();

//all spaces immediately outside the seating area are called NULL
const NULL = 0, EMPTY = 1, OCCUPIED = 2, FLOOR = 3;
const rowSize = data.indexOf('\n');
let seats = new Array(rowSize + 3).fill(NULL);

for (let i = 0; i < data.length; i++) {
    const x = data.readUInt8(i);
    switch (x) {
        case 0x4C: // L
            seats.push(EMPTY);
            break;
        case 0x2E: // .
            seats.push(FLOOR);
            break;
        case 0x23: // #
            seats.push(OCCUPIED);
            break;
        case 0x0A: // \n
            seats.push(NULL, NULL);
    }
}
seats.push(...new Array(rowSize + 3).fill(NULL));
const hrParse = process.hrtime.bigint();

//relative indexes of the adjacent locations
const adjacents = [-rowSize - 3, -rowSize - 2, -rowSize - 1, -1, 1, rowSize + 1, rowSize + 2, rowSize + 3];
let next = seats;
do {
    seats = next;
    next = new Array(seats.length);

    for (let i = 0; i < seats.length; i++) {

        // floor is floor
        if (seats[i] === FLOOR) {
            next[i] = FLOOR;
            continue;
        }

        //look for occupied adjacent seats
        let occupiedCount = 0;
        for (let j = 0; j < adjacents.length; j++) {
            let check = i + adjacents[j];
            if (check < 0)
                continue;
            if (check >= seats.length)
                break;

            while (seats[check] === FLOOR) {
                check += adjacents[j];
            }
            if (seats[check] === OCCUPIED) {
                occupiedCount++;
            }
            if (occupiedCount > 4)
                break;
        }

        // if a seat is empty and there are no occupied seats adjacent it becomes occupied
        if (seats[i] === EMPTY && occupiedCount === 0) {
            next[i] = OCCUPIED;
        }

        // if a seat is occupied and four or more adjacent seats are also occupied, it becomes empty
        else if (seats[i] === OCCUPIED && occupiedCount > 4) {
            next[i] = EMPTY;
        }

        // otherwise, the seat's state doesn't change
        else {
            next[i] = seats[i];
        }
    }
} while (!arrComp(seats, next));

function arrComp(arr1, arr2) {
    for (let i = 0; i < arr1.length && i < arr2.length; i++) {
        if (arr1[i] !== arr2[i])
            return false;
    }
    return true;
}

const result = seats.filter(x => x === OCCUPIED).length;

const hrProcess = process.hrtime.bigint();

console.log("result =", result);

console.log("Load\t\t", (hrload - hrstart) / 1000n, "μs")
console.log("Parse\t\t", (hrParse - hrload) / 1000n, "μs");
console.log("Process\t\t", (hrProcess - hrParse) / 1000n, "μs");
console.log("Total\t\t", (hrProcess - hrstart) / 1000n, "μs");

