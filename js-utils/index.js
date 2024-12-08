const _primes = [2];
function getPrimes(max){
    
    for (let i=_primes[_primes.length-1] + 1; i < max; i++){
        if (!_primes.some(x => i%x === 0)){
            _primes.push(i);
        }
    }

    return _primes.filter(x => x <= max);
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