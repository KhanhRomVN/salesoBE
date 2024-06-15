const MessageModel = require('../models/MessageModel')

module.exports = (io) => {
  io.on('connection', (socket) => {
    // console.log('A user connected: ' + socket.id);

    socket.on('joinRoom', (roomId, sender_id) => {
      socket.join(roomId);
      // console.log(`User ${sender_id} joined room: ${roomId}`);
    });

    socket.on('sendMessage', async (roomId, message, sender_id) => {
      const messageData = {
        chat_id: roomId,
        sender_id: sender_id,
        message: message
      }
      await MessageModel.addMessage(messageData)
      // console.log(`Message from ${sender_id} to room ${roomId}: ${message}`);
      io.to(roomId).emit('receiveMessage', {
        senderId: sender_id,
        message: message
      });
    });

    socket.on('disconnect', () => {
      console.log("");
    });
  });
};
