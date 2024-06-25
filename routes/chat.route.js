const express = require('express')
const { authToken } = require('../middleware/authToken')
const chatController = require('../controller/chat.controller')
const router = express.Router()

router.post('/get-history-message', authToken, chatController.getHistoryMessage)
router.post('/get-last-message', authToken, chatController.getLastMessage)
router.post('/create-group', authToken, chatController.createGroupChat)
router.post('/del-group', authToken, chatController.deleteGroupChat)
router.post('/add-user-group', authToken, chatController.addUserGroup)
router.post('/del-user-group', authToken, chatController.addUserGroup)

module.exports = router