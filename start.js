const mongoose = require('mongoose');

// import variables.env file
require('dotenv').config({ path: 'variables.env' });

// Connect to database
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🚫 → ${err.message}`);
});

require('./models/Store');
require('./models/User');

// Start app
const app = require('./app');
const server = require('http').Server(app);
const io = require('socket.io')(server);

require('./handlers/websocket')(io);

const port = process.env.PORT || 7777;
server.listen(port);

server.on('listening', () => {
  console.log('Server listening on port: ' + port)
});