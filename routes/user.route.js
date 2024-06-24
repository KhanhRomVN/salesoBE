const express = require('express');
const { authToken } = require('../middleware/authToken');
const userController = require('../controller/user.controller');

const router = express.Router();

//* User Data Routes
router.post('/user-detail', userController.getUserDetail);
router.post('/update-username', authToken, userController.updateUsername);
router.post('/update-email', authToken, userController.updateEmail);
router.post('/update-role', authToken, userController.updateRole);

//* User Detail Routes
router.post('/update-name', authToken, userController.updateName);
router.post('/update-age', authToken, userController.updateAge);
router.post('/update-gender', authToken, userController.updateGender);
router.post('/update-about', authToken, userController.updateAbout);
router.post('/update-phone', authToken, userController.updatePhone);
router.post('/update-address', authToken, userController.updateAddress);
router.post('/update-avatar', authToken, userController.updateAvatar);

//* Friend Management Routes
router.post('/add-friend', authToken, userController.addFriend);
router.post('/check-friend', authToken, userController.checkFriendStatus);
router.post('/del-friend', authToken, userController.delFriend);
router.post('/list-friend', authToken, userController.getListFriend);

//* Utility Routes
router.get('/get-all-friend', userController.getAllFriend);

module.exports = router;