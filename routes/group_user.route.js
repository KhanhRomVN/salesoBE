const express = require('express');
const { authToken } = require('../middleware/authToken');
const groupController = require('../controller/group.controller');
const router = express.Router();

//* Create Group
router.post('/create-group', authToken, groupController.createGroup);

//* Delete Group
router.post('/del-group', authToken, groupController.deleteGroup);

//* Set Status Group
// router.post('/del-group', authToken, groupController.deleteGroup);

//* Management User - Group
router.post('/add-user', authToken, groupController.addUser);
router.post('/del-user', authToken, groupController.deleteUser);
router.post('/add-list-user', authToken, groupController.addListUser);
router.post('/del-list-user', authToken, groupController.delListUser);

//* Set Role User [ Admin, Mod, Member, Guest]
router.post('/set-admin', authToken, groupController.setAdmin)
router.post('/set-mod', authToken, groupController.setMode)
router.post('/set-mem', authToken, groupController.setMember)
router.post('/set-guest', authToken, groupController.setGuest)






module.exports = router;
