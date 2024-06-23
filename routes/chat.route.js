const express = require('express')
const { authToken } = require('../middleware/authToken')
const chatController = require('../controller/chat.controller')
const router = express.Router()

//* Get all messages history about sender and receiver
router.post('/get-chat', authToken, chatController.getChatBox)

//* Get last message
router.post('/get-last-message', authToken, chatController.getLastMessage)

module.exports = router