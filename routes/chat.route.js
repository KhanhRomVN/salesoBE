const express = require('express')
const { authToken } = require('../middleware/authToken')
const chatController = require('../controller/chat.controller')

const router = express.Router()

router.post('/getchats', authToken, chatController.getChats)
router.post('/send', authToken, chatController.sendChat)


module.exports = router