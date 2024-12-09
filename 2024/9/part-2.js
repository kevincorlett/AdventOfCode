const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'input.txt');
//appending a 0 to the end of the string makes it easier to process
const input = fs.readFileSync(filePath).toString() + '0';

const disk = [];
for (let i=0;i<input.length;i+=2){
    disk.push({
        id: i/2,
        size: parseInt(input[i]),
        spaceAfter: parseInt(input[i+1])
    });
}

//reading files from the right, look for a file/space combo coming from the left with
//enough space to move the file into
for (let i=disk.length-1; i>-1; i--){
    if (disk[i].checked){
        continue;
    }

    disk[i].checked = true;
    for (let j=0; j<i; j++){ 
        
        //if the space is big enough, move the file
        if (disk[j].spaceAfter >= disk[i].size){
            //remove the file
            const file = disk.splice(i,1)[0];

            //add the space created by the removal to the preceding file
            if (i > 0){
                disk[i-1].spaceAfter = disk[i-1].spaceAfter + file.size + file.spaceAfter;
            }

            //reinsert the file
            disk.splice(j+1,0,file);

            //readjust the size of the space now a file has been move in it
            file.spaceAfter = disk[j].spaceAfter - file.size;
            
            //zero the space after the preceding file
            disk[j].spaceAfter = 0;

            //since a file was inserted, we need to bump i
            i++;
            break;
        }
    }
}

let i = 0, result = 0;
for (let file of disk){
    for (let j=i; j<i+file.size;j++){
        result += j*file.id;
    }
    i += file.size + file.spaceAfter;
}
console.log(result);
