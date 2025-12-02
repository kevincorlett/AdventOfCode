const _primes = [2,3];

//the 1-based index in the _primes array of the largest prime that is equal to
//or less than the corresponding index in the _primeIdx array.  
// E.g. the 1-based in index of the largest prime less than or equal to '4' is 2 (_primes[2-1] is 3)
const _primeIdx = [0,0,1,2];

function getPrimes(max){
    let x = 0;
    for(let i=_primes[_primes.length-1]+2;i<=max;i+=2){
        _primeIdx[i-1] = _primes.length; //even numbers > 2 are not prime, so the idx is the idx of the largest prime so far

        const sqrt = Math.sqrt(i);
        let isPrime = true;
        for(const p of _primes){
            if (i%p === 0){
                isPrime = false;
                break;
            }
            if (p > sqrt){
                break; 
            }
        }
        
        if (isPrime) {
            _primes.push(i);
        }
        _primeIdx[i] = _primes.length;
    }

    return _primes.slice(0,_primeIdx[max]);
}

function highestCommonFactor(nums){
    const invalid = nums.filter(x => typeof x !== 'number' || x === 0 || Math.floor(x) !== x);
    if (invalid.length > 0){
        throw new Error(`highestCommonFactor error - invalid values: ${invalid}`);
    }

    const sorted = nums.map(x => x < 0 ? Math.abs(x): x).toSorted((a,b) => b - a);
    let large = sorted[0], small = sorted[1];

    while (small != 0){
        let result = large % small;

        large = small;
        small = result;
    }

    if (sorted.length > 2){
        return highestCommonFactor([large,...sorted.slice(2)]);
    } else {
        return large;
    }
}


module.exports = {
    getPrimes,
    highestCommonFactor
}