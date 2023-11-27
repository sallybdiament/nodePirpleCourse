/*  Request handles:
Now we are going to define the handlers for users, and it is better to do it in this separate file and call it on index
*/

// Dependencies:
const _data = require('./data');
const helpers = require('./helpers');

// Define handlers for the router:
let handlers = {};

// Sample handlers:
// handlers.sample = function(data, callback){
//     // Callback a http status code and a payload object.
//     callback(406, { 'name': 'sample handler' });
// };

// Ping handler:
handlers.ping = function(data, callback){
    callback(200);
};

// Not found handler:
handlers.notFound = function(data, callback){
    callback(404);
};

// Users handler:
handlers.users = function(data, callback) {
    const acceptableMethods = ['post', 'get', 'put', 'delete']; // figure out which method is requesting and passing to submethod. Listing the acceptable methods.
    if (acceptableMethods.indexOf(data.method) > -1) { // if data.method exists in the array acceptableMethods, we want to call:
        handlers._users[data.method](data, callback);   // _users: private methods used by users methods
    } else { // if the method does not exist in the array acceptableMethods, we want to call:
        callback(405) // 405: http method not allowed
    }
};

// Container for the users submethods:
handlers._users = {};

// Users: post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = function(data, callback) {
    // check that all required fields are filled out:
    let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make that the user does not already exists by the phone number
        // Saving a file: yourPhoneNumber.json
        _data.read('users', phone, function(err, data) {
            if(err) {
                // Hash the password:
                let hashedPassword = helpers.hash(password) // in helpers, we created a function to hash the password with sha253 and the crypto dependency of node
            
                if (hashedPassword) {
                    // Create the users object:
                    let userObject = {
                        firstName,
                        lastName,
                        phone, 
                        tosAgreement: true
                    }

                    // Store the user:
                    _data.create('users', phone, userObject, function(err){
                        if (!err) {
                            callback(200)
                        } else {
                            console.log(err);
                            callback(500, { 'Error': 'Could not create the new user'});
                        }
                    });
                } else {
                    callback(500, { 'Error': 'Could not hash the user\'s password' });
                }
            
            } else {
                // User already exists:
                callback(400, { 'Error': 'A user with that phone number already exists'});
            }
        })

    } else {
        callback(400, { 'Error': 'Missing required fields' }); // if any of the required fields are missing, we want to return an error with the message 'Missing required fields'.
    }
};

// Users: get
handlers._users.get = function(data, callback) {

};

// Users: put
handlers._users.put = function(data, callback) {

};

// Users: delete
handlers._users.delete = function(data, callback) {

};

module.exports = handlers;