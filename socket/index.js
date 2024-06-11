const express = require('express')
const { Server } = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, credentials: true }
})

io.on('connection', (socket) => {
  console.log("User connected: ", socket.id)

  socket.on('room', (data) => {
    try {
      socket.join(data)
      console.log("User", socket.id, "joined room with chat_id: ", data)
    } catch (error) {
      console.error('Error when joining room:', error)
    }
  })

  socket.on('send', (data) => {
    try {
      io.to(data.room).emit('receive', { 
        room: data.room,
        text: data.text
      })
    } catch (error) {
      console.error('Error sending message:', error)
    }
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

module.exports = {
  app,
  server
}
