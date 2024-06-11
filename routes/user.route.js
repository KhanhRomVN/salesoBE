const express = require('express');
const authToken = require('../middleware/authToken');
const userController = require('../controller/user.controller');

const router = express.Router();

router.post('/updates', authToken, userController.updateS);
router.post('/update-role', authToken, userController.updateRole);
router.post('/friends', authToken, userController.getFriends);

module.exports = router;
