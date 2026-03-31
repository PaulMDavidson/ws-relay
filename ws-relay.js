const WebSocket = require('ws');

const ws_c = new WebSocket.Server({ port: 8080 });  // Clients to connect to this port
const ws_s = new WebSocket.Server({ port: 8081 });  // Server to connect here

ws_c.on('connection', function connection(ws) {
  console.log('Client connected');

  // When a message is received from a client
  ws.on('message', function incoming(message) {
    console.log('received from client: %s', message);

  // Relay the message to server
  if (ws_s.readyState === WebSocket.OPEN) {
    ws_s.send(message);
  }

  ws.on('close', function close() {
    console.log('Client disconnected');
  });

  ws.on('error', function error(err) {
    console.error('WebSocket error:', err);
  });
});

ws_s.on('connection', function connection(ws) {
  console.log('Server connected');

  // When a message is received from the server
  ws.on('message', function incoming(message) {
    console.log('received from server: %s', message);

    // Relay the message to clients
    ws_c.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', function close() {
    console.log('Server disconnected');
  });

  ws.on('error', function error(err) {
    console.error('WebSocket error:', err);
  });
});

console.log('WebSocket relay server started on ports 8080 and 8081');
