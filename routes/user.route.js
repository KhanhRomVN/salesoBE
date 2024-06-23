const express = require('express');
const { authToken } = require('../middleware/authToken')
const userController = require('../controller/user.controller');

const router = express.Router();

//* Get data user
router.post('/user-detail', userController.getUserDetail);

//! Update data user (don't code yet)
router.post('/update-user', authToken, userController.updateUser);

//* Update username and role
router.post('/update-username', authToken, userController.updateUserName);
router.post('/update-role', authToken, userController.updateRole);

//* Add friend, get list friend, del friend and check friend status
router.post('/add-friend', authToken, userController.addFriend);
router.post('/check-friend', authToken, userController.checkFriendStatus);
router.post('/del-friend', authToken, userController.delFriend);
router.post('/list-friend', authToken, userController.getListFriend);

//* Get all friend from collection 'user'
// ! Just for search bar
router.get('/get-all-friend', userController.getAllFriend)

module.exports = router;
