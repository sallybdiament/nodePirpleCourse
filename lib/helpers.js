/* Helpers for various tasks:
*/

// Dependencies:
const crypto = require('crypto');
const config = require('./config');

// Container for all the helpers:
const helpers = {};

// Create a SHA256 hash:
helpers.hash = function(str) {
    if (typeof(str) == 'string' && str.length > 0) { 
        let hash = crypto.createHmac('sha256',config.hashingSecret).update(str).digest('hex'); // hashing the string with sha256
        return hash;
    } else {
        return false;
    }
};

// Create a function that takes in an arbitraty string and returns a json with json.parse, because json.parse throws an error if it can't parse:
helpers.parseJsonToObject = function(str) {
    try { 
        let obj = JSON.parse(str);
        return obj;
    } catch (e) {  return {}; }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(strLength) {
    console.log('strLength', strLength)
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    console.log('strLength', strLength)
    if (strLength) {
        // Define all the possible characters that could go into the string
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

        // Start the final string:
        let str = '';
        for (let i = 0; i < strLength; i++) {
            // Get a random character from the possibleCharacters:
            let randomChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            console.log('randomChar: ' + randomChar)
            // Apppend this character to final string:
            str += randomChar;  
            console.log('str: ' + str)
        }
        // Return the final string:
        return str;
    } else {
        return false;
    }
};

module.exports = helpers;