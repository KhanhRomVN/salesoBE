const express = require('express');
const { authToken } = require('../middleware/authToken');
const groupController = require('../controller/group.controller');
const router = express.Router();

//! Group Management
//* Create&Delete 
router.post('/create-group', authToken, groupController.createGroup);
router.post('/del-group', authToken, groupController.deleteGroup);
//* Update Group
router.post('/update-name', authToken, groupController.updateNameGroup);
router.post('/update-about', authToken, groupController.updateAboutGroup);
router.post('/update-avatar', authToken, groupController.updateAvatarGroup);
router.post('/update-background', authToken, groupController.updateBackgroundGroup);
//* Set Status Group
router.post('/set-status', authToken, groupController.setStatus); // public group or private group
router.post('/set-is-active', authToken, groupController.setIsActive); // active group (people can see) or un-active

//! Member Management
//* Admin
router.post('/set-role-mem', authToken, groupController.setMember)
router.post('/del-list-user', authToken, groupController.delListUser);

//* Admin & Mod
router.post('/del-user', authToken, groupController.deleteUser);
router.post('/accept', authToken, groupController.acceptRequest)
router.post('/refuse', authToken, groupController.refuseRequest)

//* Guest
router.post('/join', authToken, groupController.joinGroup)

//* All Member Group
router.post('/invite-user', authToken, groupController.addUser); //Send invitations to the group
router.post('/leave-group', authToken, groupController.leaveGroup); // Dont user for admin role
router.post('/get-list-admin', authToken, groupController.getListAdmin); 
router.post('/get-list-mod', authToken, groupController.getListMod); 
router.post('/get-list-member', authToken, groupController.getListMember); 
router.get('/get-data-member', authToken, groupController.getDataMemver); 
router.get('/create-post', authToken, groupController.getDataMemver); 



module.exports = router;
