module.exports = io => {
  io.on('connect', socket => {
    console.log('User connected with id:', socket.id);

    socket.on('buttonClick', message => {
      socket.emit('clientMessage', message);
      socket.broadcast.emit('clientMessage', message);
    });
  });
};