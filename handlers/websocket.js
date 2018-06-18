module.exports = io => {
  io.on('connect', socket => {
    console.log('User connected with id:', socket.id);

    socket.on('message', message => {
      io.emit('clientMessage', message);
    });
  });
};