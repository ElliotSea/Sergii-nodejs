var querystring = require("querystring");
var fs = require("fs");
var exec = require("child_process").exec;
var formidable = require("formidable");

function start(response, request) {
console.log("Request handler 'start' was called.");
var body = '<html>'+
'<head>'+
'<meta http-equiv="Content-Type" '+
'content="text/html; charset=UTF-8" />'+
'</head>'+
'<body>'+
'<form action="/upload" enctype="multipart/form-data" '+
'method="post">'+
'<input type="file" name="upload">'+
'<input type="submit" value="Upload file" />'+
'</form>'+
'</body>'+
'</html>';
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}

function upload(response, request) {
console.log("Request handler 'upload' was called.");

var form = new formidable.IncomingForm(); 
console.log("about to parse");
form.parse(request, function(error, fields, files) { 
console.log("parsing done");
    /* Possible error on Windows systems:
       tried to rename to an already existing file */
fs.rename(files.upload.path, "/tmp/test.png", function(error) { 
	if (error) {
        fs.unlink("/tmp/test.png");
        fs.rename(files.upload.path, "/tmp/test.png");
      }
    });
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
}); 
}

function show(response, request) {
		console.log("Request handler 'show' was called.");
		fs.readFile("./tmp/test.png", "binary", function(error, file) {
		if (error) {
		response.writeHead(500, {"Content-Type": "text/plain"});
		response.write(error + "\n");
		response.end();
		} else {
		response.writeHead(200, {"Content-Type": "image/png"});
		response.write(file, "binary");
		response.end();
	} });
}

function ls(response) {
console.log("Request handler 'ls' was called.");
		exec("ls -l", function(error, stdout, stderr){
	    response.writeHead(200, {"Content-Type": "text/plain"});
		response.write(stdout);
		response.end();
	})
}

function sendmessage(response, request){
	console.log("Request handler 'sendmessage' was called.");
var body = '<html>'+
'<head>'+
'<meta http-equiv="Content-Type" content="text/html; '+
'charset=UTF-8" />'+
'</head>'+
'<body>'+
'<form action="/message" method="post">'+
'<textarea name="text" rows="20" cols="60"></textarea>'+
'<input type="submit" value="Send message" />'+
'</form>'+
'</body>'+
'</html>';
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}


function message(response, request){
	console.log("Request handler 'message' was called.");
var twilio = require('twilio');
var client = new twilio.RestClient('AC1b45525cc1b3f67b7371f97d6b430111', 'ee4e007fa6197618a94afde506f21349');
 
client.messages.create({
    to: "+13057333927",
    from: "+17866299527",
    body: querystring.parse(request).text
}, function(err, message) {
    process.stdout.write(message.sid);
});
	    response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("You have sent message: " + querystring.parse(request).text);
		response.end();
console.log("You have sent message: " + querystring.parse(request).text);
}

exports.sendmessage = sendmessage;
exports.message = message;
exports.ls = ls;
exports.start = start;
exports.upload = upload;
exports.show = show;