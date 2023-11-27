/*
* Library for storing and editing data
*/

// Dependencies:
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

// Containerfor the module (to be exported):
let lib = {};

// Define the base directory of the data folder:
lib.baseDir = path.join(__dirname, '/../.data/');

// Write data to a file:
lib.create = function(dir, filename, data, callback){
    // Open the file for writing:
    fs.open(lib.baseDir+dir+'/'+filename+'.json', 'wx', function(err, fileDescriptor){
        if(!err && fileDescriptor) {
            // convert data to string (always need to convert to string):
            let stringData = JSON.stringify(data);

            // write to file and close it:
            fs.writeFile(fileDescriptor, stringData, function(err){
                if (!err) {
                    callback(false);
                } else {
                    callback('Error closing new file.')
                }
            });
        } else { 
            callback('Could not create new file, it may already exists.');
        }
    }); 
};

// Read the data from a file:
lib.read = function(dir, filename, callback) {
    fs.readFile(lib.baseDir+dir+'/'+filename+'.json', 'utf8', function(err, data) {
        if (!err && data) {
            let parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        } else { callback(err, data); } // now, instead of call back the raw data, let's call back the json data.
    });
};

// Updating data inside a file:
lib.update = function(dir, filename, data, callback){
 // Open the file for writing:
 fs.open(lib.baseDir+dir+'/'+filename+'.json', 'r+', function(err, fileDescriptor){ // r+ flag: to write in a file that already exists.
    if(!err && fileDescriptor) {
        // convert data to string (always need to convert to string):
        let stringData = JSON.stringify(data);

        // Truncate the content of the file, before writting on it:
        fs.ftruncate(fileDescriptor, function(err){
            if (!err) {
                // write to file and close it:
                fs.writeFile(fileDescriptor, stringData, function(err){
                    if (!err) {
                       fs.close(fileDescriptor, function(err){
                            if(!err) {
                                callback(false)
                            } else {
                                callback('Error closing file.')
                            }
                       });
                    } else {
                        callback('Error writing on the file.')
                    }
                });
            } else {
                callback('Error deleting file.');
            }
        })
    } else { 
        callback('Could not open the file for updating, it may not exists yet.');
    }
});
};

// Deleting a file:
lib.delete = function(dir,filename,callback) {
    // Unlink the file (remove from the filesystem):
    fs.unlink(lib.baseDir+dir+'/'+filename+'.json', function(err){
        if (!err) {
            callback(false);
        } else {
            callback('Error deleting file');
        }
    })
}


// Export the module:
module.exports = lib;