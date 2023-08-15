const multiply = (a, b) => {
    const m = [];
    for(let i=0;i<a.length;i++){
        for (let j=0;j<b.length;j++){
            if (m[j+i]){
                m[j+i] += a[i]*b[j];
            } else {
                m[j+i] = a[i]*b[j];
            }
        }
    }

    flush(m);

    return m;
}

const add = (a,b) => {
    const m = [];
    for (let i=0; i<a.length && i<b.length; i++){
        m[i] = (a[i] || 0) + (b[i] || 0);
    }

    flush(m);

    return m;
}

const subtract = (a,b) => {
    const m = [];
    for (let i=0; i<a.length && i<b.length; i++){
        m[i] = (a[i] || 0) - (b[i] || 0);
    }

    flush(m);

    return m;
}

//Return 1 if a > b, 0 if a == b, -1 if a < b
const gte = (a,b) => {
    const max = b.length > a.length ? b.length : a.length;
    let result = 0;
    for (let i=max-1;i>-1 && result == 0;i--){
        result = (a[i] || 0) - (b[i] || 0);
    }

    return Math.sign(result);
}

//Iterates through an array in-place, ensuring all elements are <10
//e.g. [32] would become [2,3]  and [32,4,56,8] would become [2,7,6,3,1]
function flush(m) {
    for (let i = 0; i<m.length; i++){
        console.log(m);
        if (i > 10){
            break;
        }
        if (typeof m[i] !== 'number')
            throw `${m[i]} is not a number`

        while (m[i] < 0 && m[i+1] !== undefined){
            m[i+1] -= 1;
            m[i] += 10;
        }

        if (m[i] < 10)
            continue;

        if (!m[i+1])
            m[i+1] = 0;

        m[i+1] += Math.floor(m[i] / 10);
        
        m[i] = m[i] % 10;
    }
    
}

// console.log(gte([6,8,9],[7,8,9]));

// const result = multiply([1,2,3],[3,2,1]);
const result = subtract([8,4,5],[7,8,9]);
for(let i=result.length-1;i>-1;i--){
    process.stdout.write(result[i].toString());
}


module.exports = { multiply, add, subtract, gte };