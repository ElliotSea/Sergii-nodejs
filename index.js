var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/ls"] = requestHandlers.ls;
handle["/show"] = requestHandlers.show;
handle["/message"] = requestHandlers.message;
handle["/sendmessage"] = requestHandlers.sendmessage;


server.start(router.route,handle);