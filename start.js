const mongoose = require('mongoose');

// import variables.env file
require('dotenv').config({ path: 'variables.env' });

// Connect to our Database
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`🚫 → ${err.message}`);
});

require('./models/Store');
require('./models/User');

// Start app
const app = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);

require('./handlers/websocket')(io);

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});