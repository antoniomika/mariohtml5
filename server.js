var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var os = require('os');
var ifaces = os.networkInterfaces();

console.log("Attempt to connect through these IPs (http://<ip>/ for a desktop and http://<ip>/client for the mobile device");

//http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
  });
});

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
