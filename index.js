/*
* Primary file for the API
*
*/

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder; // This is used the get the payload.

// The server should respond to all requests with a string 
let server = http.createServer(function(req, res){
    /* What is comming back from/in this callback "(function(req,res)"": 
        when we create the server and then tell it to listen, 
        when a request comes in, both of these objects are filled out and set to the function below,
        every single time the request comes in.
        Someone hits localhost:3000, all this function below gets called and 'req' and 'res' are new everytime.
        The 'req' object contains a bunch of information about what that user is asking for.
    */

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

    // Send the response:
    res.end('Hello world!');
    
    // Log the request path:
    console.log('Request received on path: ', trimmedPath, ' with method: ', method,
    'and with this query string parameters: ', queryStringObject,
    '. Request received with headers: ', headers); //to see it, need to send the headers in postman or thunderclient.
    console.log('and this payload: ', buffer); //to see it, need to send the headers in postman or thunderclient.
    });
});

//Start teh server and have it listen on port 3000
server.listen(3000, function(){
    console.log( "The server is listening on port 3000");
});