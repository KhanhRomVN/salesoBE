const express = require('express')
const commentController = require('../controller/comment.controller')
const { authToken } = require('../middleware/authToken')
const router = express.Router()

//* Create & Delete Comment
router.post('/create-comment', authToken, commentController.createComment)
router.post('/delete-comment', authToken, commentController.deleteComment)

//* Update Comment
router.post('/update-content', authToken, commentController.updateContent)
router.post('/update-image', authToken, commentController.updateImage)
router.post('/del-image', authToken, commentController.delImage)

//* Get Comment
router.post('/get-list-comment-by-post-id', commentController.getListCommentByPostId)

module.exports = router