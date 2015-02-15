var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static("mariohtml5"));

app.get('/', function (req, res) {
    res.sendfile('mariohtml5/main.html');
});

app.get('/client', function (req, res) {
    res.sendfile('mariohtml5/client.html');
});

io.on('connection', function (socket) {
    socket.on('motionData', function (data) {
        console.log(data);
        io.sockets.emit('motionData', data);
    });
    socket.on('jump', function (data) {
        console.log("JUMP", data);
        io.sockets.emit('jump', data);
    });
});

server.listen(3000);
