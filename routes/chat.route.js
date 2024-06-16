const express = require('express')
const { authToken } = require('../middleware/authToken')
const chatController = require('../controller/chat.controller')

const router = express.Router()

router.post('/get-chat', authToken, chatController.getChatBox)
router.post('/get-last-message', authToken, chatController.getLastMessage)

module.exports = router