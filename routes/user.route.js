const express = require('express');
const { authToken } = require('../middleware/authToken');
const userController = require('../controller/user.controller');

const router = express.Router();

//* Get User Data
router.post('/user-detail', userController.getUserData);

//* Update User
router.post('/update-username', authToken, userController.updateUsername);
router.post('/update-email', authToken, userController.updateEmail);
router.post('/update-role', authToken, userController.updateRole);

//* Update Detail User
router.post('/update-name', authToken, userController.updateName);
router.post('/update-age', authToken, userController.updateAge);
router.post('/update-gender', authToken, userController.updateGender);
router.post('/update-about', authToken, userController.updateAbout);
router.post('/update-address', authToken, userController.updateAddress);
router.post('/update-avatar', authToken, userController.updateAvatar);

//* Change Password
router.post('/update-password', authToken, userController.updatePassword);

//* Change Password But I Forget Password
router.post('/forget-password', authToken, userController.forgetPassword); 
router.post('/update-forget-password', authToken, userController.updateForgetPassword); 

//* Friend Management Routes
router.post('/add-friend', authToken, userController.addFriend);
router.post('/check-friend', authToken, userController.checkFriendStatus);
router.post('/del-friend', authToken, userController.delFriend);
router.post('/list-friend', authToken, userController.getListFriend);

module.exports = router;