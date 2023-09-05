/*
* Primary file for the API
*
*/

// Dependencies
const http = require('http');
const https = require('https');
const { type } = require('os');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder; // This is used the get the payload.
const config = require('./config.js'); // Import the file 'config.js' with the environment variable.
const fs = require('fs'); // Require de fs build module of Node.js.
const _data = require('./lib/data');

// Testing to create a new file in folder .data::
_data.create('test', 'newFile', {'foo': 'bar'}, function(err){
    console.log('this is the err: ', err);
});
// // Testing to read a new file in folder .data::
_data.read('test', 'newFile', function(err){
    console.log('this is the err: ', err);
});
// Testing to update a new file in folder .data::
_data.update('test', 'newFile', {'bla': 'buzz'},function(err, data){
    console.log('this is the err: ', err, 'and this is the data: ', data);
});
// Testing to delete a file in folder .data::
_data.delete('test', 'newFile',function(err){
    console.log('this is the err: ', err);
})

// The server should respond to all requests with a string 
let httpServer = http.createServer(function(req, res){
    /* What is comming back from/in this callback "(function(req,res)"": 
        when we create the server and then tell it to listen, 
        when a request comes in, both of these objects are filled out and set to the function below,
        every single time the request comes in.
        Someone hits localhost:3000, all this function below gets called and 'req' and 'res' are new everytime.
        The 'req' object contains a bunch of information about what that user is asking for.
    */

    // Instantiating the server and then start the server.
    unifiedServer(req,res);

});

//Start the server and have it listen on port defined on config.js:
httpServer.listen(config.httpPort, function(){
    console.log( "The server is listening on port http ", config.httpPort, ' in', config.envName,'now');
});

// Instantiate the https server:
let httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'), // reading the content of the file key.pem synchronously, so it can create a secure server.
    'cert': fs.readFileSync('./https/cert.pem'), // readding the content of the file cert.pem synchronously, so it can create a secure server.
};
let httpsServer = https.createServer(httpsServerOptions, function(req,res){
    unifiedServer(req, res);
});
// Start the https server:
httpsServer.listen(config.httpsPort, function(){
    console.log( "The server is listening on port https ", config.httpsPort, ' in', config.envName,'now');
});

// All the server logic for both http and https servers:
let unifiedServer = function(req, res){
    // Get the URL and parse it:
    let parsedUrl = url.parse(req.url, true);
    /* In this case, we want the url the users is asking for, so we get it from the 'req' object (req.url)
        The second parameter is true to call the query string method in order a parsed url object that is fully complete, 
        including the parsing string data.
        parsedUrl: is an object with a bunch of keys of parsed meta data about the request path or url that came in.
    */
    
    // Get the path from the URL:
    /* The pathname is the key of parsedUrl that has just what there is after 'http://'. */
    
    // If you are curious about the complete object in parsedUrl:
    // const util = require('util')
    // console.log('parsedUrl complete object:', util.inspect(parsedUrl, {showHidden: false, depth: null, colors: true}))
    // console.log('req complete object:', util.inspect(req, {showHidden: false, depth: null, colors: true}))
   
    let path = parsedUrl.pathname;
    /* Simple string replace with regex: trim of the slashes (remove the slashes at the beginning or at the end). */
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');
    
    // Get the query string as an object:
    /* Query is after the '?' in the url, to execute need to use '' (because of zsh): curl 'http://example?fizz=buzz' */
    let queryStringObject = parsedUrl.query;

    // Get the http method:
    let method = req.method.toLocaleLowerCase();

    // Get the heaaders as an object:
    let headers = req.headers;

    // Get the payload, if there is any:
    let decoder = new StringDecoder('utf-8'); // utf-8: what kind of charset is expected here.
    let buffer ='';
    /* Payloads come as a stream. 
    The request object emmits the event and we get this event on 'req.on' and we append the result on the variable buffer.
    */
    req.on('data', function(data){
        buffer += decoder.write(data); // We use the decoder to transform into a string.
    });

    /* The 'end' event is always going to be called. Even if the 'on' event is not called. */
    req.on('end', function(){
        buffer +=decoder.end();

        // Choose the handler this request should go to. If one is not found, use the notFound handler.
        let choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound; 
        /* If the path exhists (it is not undefined), it should go to this path through the router, otherwise it should go to notFound router. */

        // Construct the data object to send to the handler:
        let data = {
            trimmedPath,
            queryStringObject,
            method,
            headers,
            payload: buffer
        };

        // Route the request to the handler specified in the router:
        choosenHandler(data, function(statusCode, payload) {
            // Use the status code called back by the handler or default to 200:
            statusCode = typeof statusCode === 'number' ? statusCode : 200;
            
            // Use the payload called back by the handler or defaults to an empty object:
            payload = typeof(payload) == 'object' ? payload : {};

            // We have to conver the payload to a string:
            let payloadString = JSON.stringify(payload); // This is the payload that the handler is sending back to the user.
            
            // Return the response:
            res.setHeader('Content-Type', 'application/json'); // key and value: this is telling to the browser we are sending key and value.
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('StatusCode: ', statusCode, 'and the payload: ', payloadString);
        });
    
    // Log the request path:
    // console.log('Request received on path: ', trimmedPath, ' with method: ', method,
    // 'and with this query string parameters: ', queryStringObject,
    // '. Request received with headers: ', headers); //to see it, need to send the headers in postman or thunderclient.
    // console.log('and this payload: ', buffer); //to see it, need to send the headers in postman or thunderclient.
    });
}

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

// Define a request router:
let router = {
    // 'sample': handlers.sample,
    'ping': handlers.ping //easilly find out if the application is alive.
}; // each path is unique, so we can use an object
