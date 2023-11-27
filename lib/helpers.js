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
}

// Create a function that takes in an arbitraty string and returns a json with json.parse, because json.parse throws an error if it can't parse:
helpers.parseJsonToObject = function(str) {
    try { 
        let obj = JSON.parse(str);
        return obj;
    } catch (e) {  return {}; }
}

module.exports = helpers;