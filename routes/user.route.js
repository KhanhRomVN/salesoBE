const express = require('express');
const { authToken } = require('../middleware/authToken');
const userController = require('../controller/user.controller');

const router = express.Router();

//* Get User + User Detail
router.post('/get-user-data', userController.getUserData);

//* Update User
router.post('/update-username', authToken, userController.updateUsername);
router.post('/update-email', authToken, userController.updateEmail);
router.post('/update-role', authToken, userController.updateRole);

//* Update User Detail
router.post('/update-name', authToken, userController.updateName);
router.post('/update-age', authToken, userController.updateAge);
router.post('/update-gender', authToken, userController.updateGender);
router.post('/update-about', authToken, userController.updateAbout);
router.post('/update-address', authToken, userController.updateAddress);
router.post('/update-avatar', authToken, userController.updateAvatar);

//* Update Password [ User ]
router.post('/update-password', authToken, userController.updatePassword);
router.post('/forget-password', authToken, userController.forgetPassword); 
router.post('/update-forget-password', authToken, userController.updateForgetPassword); 

//* Check Google & Linked Google Account
router.post('/check-google', authToken, userController.checkGoogle); 
router.post('/link-google', authToken, userController.linkGoogle); 

//* Friend User [ User Detail ]
router.post('/send-friend-request', authToken, userController.sendFriendRequest);
router.post('/accept', authToken, userController.acceptRequest);
router.post('/refuse', authToken, userController.refuseRequest);
router.get('/check-friend-status', authToken, userController.checkFriendStatus);
router.get('/get-list-friend', authToken, userController.getListFriend);
router.post('/unfriend', authToken, userController.unfriend);

//* Block Friend
router.post('/block-friend', authToken, userController.blockFriend);
router.post('/unblock-friend', authToken, userController.unblockFriend);

module.exports = router;