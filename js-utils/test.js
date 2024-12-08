const utils = require('./index.js');

//I choose this moment to add some tests when npm is down for maintenance - TODO add some actual tests
console.log(utils.getPrimes(100));

console.log(utils.highestCommonFactor([21,14])); //7
console.log(utils.highestCommonFactor([5, -40, 20, 10])); //5
console.log(utils.highestCommonFactor([140,70, 7])); //7
console.log(utils.highestCommonFactor([140,11])); //1