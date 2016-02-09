var http = require('http');
var WebSocket = require('ws').Server;
var express = require('express');
var chatHandler = require('./chatHandler');

var server = http.createServer();
var wss = new WebSocket({server});
wss.on('connection', chatHandler);

var app = express();
app.use(express.static('./static'));

server.on('request', app);

server.listen(3000, () => console.log("running on port 3000"));

