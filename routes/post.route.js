const express = require('express');
const { authToken } = require('../middleware/authToken');
const postController = require('../controller/post.controller');
const router = express.Router();

//* Create & Delete & Set Status & Update 
router.post('/create-post', authToken, postController.createPost);
router.post('/delete-post', authToken, postController.deletePost);
router.post('/set-status', authToken, postController.setStatus);
router.post('/update-post', authToken, postController.updatePost); 

//* Get Post
router.post('/get-post-by-post-id', authToken, postController.getPostByPostId);
router.post('/get-list-post-by-user-id', authToken, postController.getListPostByUserId);
router.post('/get-list-post-by-group-id', postController.getListPostByGroupId);

//* Interact Post
router.post('/like', authToken, postController.likePost); 
router.post('/unlike', authToken, postController.unLikePost); 
router.post('/share', authToken, postController.sharePost); 

module.exports = router;