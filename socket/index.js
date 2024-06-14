module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    socket.on('sendMessage', (roomId, message) => {
      console.log(`Message from ${socket.id} to room ${roomId}: ${message}`);
      io.to(roomId).emit('receiveMessage', {
        senderId: socket.id,
        message: message
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected: ' + socket.id);
    });
  });
};
