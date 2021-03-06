// Requires
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
var path    = require('path');

var ipaddr = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_INTERNAL_PORT || 8080;

// Static files
app.use(express.static(path.join(__dirname,'public')));

// Routines
app.get('/', function(req,res){
	res.sendFile(path.join(__dirname, 'public', 'balloon.html'));
})
.use(function(req, res){
	res.status(404).send('404\nPage introuvable.');
});

// Clients
var nb = 0;
var balloons = {};

// Sockets
io.sockets.on('connection', function(socket){
	
	// New client connected
	console.log('New client connected.');
	socket.emit('newClient', nb);
	nb += 1;

	// A message is sent
	socket.on('newMessage', function(key, auth, msg, x, n){
		socket.broadcast.emit('newMessage', key, auth, msg, x, n);
	});
});

server.listen(port, ipaddr);