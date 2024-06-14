const express = require('express');
const { authToken } = require('../middleware/authToken')
const userController = require('../controller/user.controller');

const router = express.Router();

router.post('/user-detail', userController.getUserDetail);
router.post('/update-user', authToken, userController.updateUser);
router.post('/update-role', authToken, userController.updateRole);
router.post('/add-friend', authToken, userController.addFriend);
router.post('/check-friend', authToken, userController.checkFriendStatus);
router.post('/del-friend', authToken, userController.delFriend);
router.post('/list-friend', authToken, userController.getListFriend);





module.exports = router;
