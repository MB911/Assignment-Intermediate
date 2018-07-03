// const webSocketServer = require('ws').Server;
var WebSocketServer = require('websocket').server;
var http = require('http');
const net = require('net');

var HOST = 'localhost';
var PORT = 9000;

var client = null;


var server = http.createServer(function(request, response) {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
});
server.listen(1337, function() { });

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {

// console.log(message);
    function OpenConnection() {

      if (client) {
        console.log('Connection Already Open');
        return;
      }

      client = new net.Socket();

      client.on('err', function (err) {
        client.destroy();
        client = null;
        console.log('There is an error:', err.message);
      });

      client.on('data', function (data) {
        console.log(data);
        connection.sendUTF(data);
      });

      client.connect(PORT, HOST, function() {
        console.log('Connection Successful');
      });
    }

    function SendData(data) {
      if (!client) {
        console.log('Connection not open, Choose option 1 first');
      }

      client.write(data);
    }

    function CloseConnection() {
      if (!client) {
        console.log('Connection already closed');
      }

      client.destroy();
      client = null;
    }

    setTimeout(function() {
      OpenConnection();
      SendData('data');
    }, 0);
  });

  connection.on('close', function(connection) {
    // close user connection
  });
});
