const number = (a) => { 
    return flush([a]);
}
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
    for (let i=0; i<a.length || i<b.length; i++){
        m[i] = (a[i] || 0) + (b[i] || 0);
    }

    flush(m);

    return m;
}

const subtract = (a,b) => {
    const cmp = gte(a,b);
    if (cmp == 0){
        return [0];
    }
    if (cmp == -1){
        throw "Negative numbers not supported";
    }
    const m = [];
    for (let i=0; i<a.length; i++){
        m[i] = (a[i] || 0) - (b[i] || 0);
    }

    flush(m);

    return m;
}

const divide = (a,b) => {
    const d = [];

    //pam is the name I've given to the number that's not the divisor (the other number)
    let pam = [];

    for (let i=a.length-1;i>-1;i--){
        
        //insert the next digit from the numerator into pam
        pam.splice(0, 0, a[i]);
        
        // console.log(`i=${i}\npam=${pam}\nd=${d}`);

        //is the divisor bigger than pam?  if so, insert 0 into the result at this position and
        //move onto the next digit in the numerator
        const cmp = gte(b, pam);
        if (cmp > 0){
            d[i] = 0;
            continue;
        }

        //now we have a value for pam that is bigger than the divisor, we can see how many times the divisor goes into pam
        let z = 0, remainder=[0];
        for (z=0;z<11;z++){
            const y = multiply(b, [z]);
            const cmp = gte(y, pam);
            if (cmp > 0){ //we've found a multiple of the divisor that is bigger than pam.
                z--; //the number of times the divisor goes into pam
                remainder = subtract(pam, multiply([z],b)); //the remainder
                // console.log(`subtract(${pam}, ${multiply([z],b)}) = ${remainder}`)
            }
            if (cmp > -1) //we've found a multiple of the divisor that is greater than or equal to the value of pam
                break; //break out of the loop - we're done here
        }

        //so we've found that the divisor goes into pam z times - put this digit into the result at position i
        d[i] = z;

        //we need to recreate pam as being equal to the remainder
        pam = remainder;
    }

    flush(d);
    flush(pam);
    return { div: d, rem: pam };

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

const stdout = (a) => {
    for(let i=a.length-1; i>-1;i--){
        process.stdout.write(a[i]);
    }
}

const dividesBy = (a,b) => {
    return divide(a,b).rem.length == 0;
}

//Iterates through an array in-place, ensuring all elements are <10
//e.g. [32] would become [2,3]  and [32,4,56,8] would become [2,7,6,3,1]
//Also works backwards through the array and removes any trailing zeroes
function flush(m) {
    for (let i = 0; i<m.length; i++){
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

    //remove trailing 0s
    while (m[m.length-1] == 0){
        m.pop();
    }
    return m;
}

module.exports = { multiply, add, subtract, divide, gte, number, stdout, dividesBy };