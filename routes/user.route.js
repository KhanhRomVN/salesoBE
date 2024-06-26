const express = require('express');
const { authToken } = require('../middleware/authToken');
const userController = require('../controller/user.controller');
const router = express.Router();

//* Get User + User Detail
router.post('/get-user-data', userController.getUserData);

//* Update User [username, email, role] & [name, age. gender, about, address, avatar]
router.post('/update-user-field', authToken, userController.updateUserField);
router.post('/update-user-detail-field', authToken, userController.updateUserDetailField);

//* Update Password
router.post('/update-password', authToken, userController.updatePassword);
router.post('/forget-password', authToken, userController.forgetPassword);
router.post('/update-forget-password', userController.updateForgetPassword);

//* Google Account
router.post('/check-google', authToken, userController.checkGoogle);
router.post('/link-google', authToken, userController.linkGoogle);

//* Friend Request
router.post('/friend-request', authToken, userController.friendRequest);
router.post('/friend-actions', authToken, userController.friendActions);
router.post('/get-list-friend-request', authToken, userController.getListFriendRequest);
router.post('/check-friend-status', authToken, userController.checkFriendStatus);
router.post('/get-list-friend', authToken, userController.getListFriend);

//* Block Friend
router.post('/block-friend', authToken, userController.blockFriend);
router.post('/unblock-friend', authToken, userController.unblockFriend);
router.post('/get-list-block-friend', authToken, userController.getListBlockFriend);

module.exports = router;
