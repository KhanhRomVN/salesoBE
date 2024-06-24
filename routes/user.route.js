const express = require('express');
const { authToken } = require('../middleware/authToken')
const userController = require('../controller/user.controller');

const router = express.Router();

//* Get data user
router.post('/user-detail', userController.getUserDetail);

//* Update user data
router.post('/update-username', authToken, userController.updateUsername);
router.post('/update-email', authToken, userController.updateEmail);
router.post('/update-role', authToken, userController.updateRole);

//* Change Password
// router.post('/update-password', authToken, userController.updatePassword);

//* Update user detail data
router.post('/update-name', authToken, userController.updateName);
router.post('/update-age', authToken, userController.updateAge);
router.post('/update-gender', authToken, userController.updateGender);
router.post('/update-about', authToken, userController.updateAbout);
router.post('/update-phone', authToken, userController.updatePhone);
router.post('/update-address', authToken, userController.updateAddress);
router.post('/update-avatar', authToken, userController.updateAvatar);

//* Check google account & Linked Account
// router.post('/check-google', authToken, userController.checkGoogle);
// router.post('/linked-google', authToken, userController.linkedGoogle);

//* Add friend, get list friend, del friend and check friend status
router.post('/add-friend', authToken, userController.addFriend);
router.post('/check-friend', authToken, userController.checkFriendStatus);
router.post('/del-friend', authToken, userController.delFriend);
router.post('/list-friend', authToken, userController.getListFriend);

//* Get all friend from collection 'user'
// ! Just for search bar
router.get('/get-all-friend', userController.getAllFriend)

module.exports = router;
