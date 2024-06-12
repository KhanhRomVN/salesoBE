const express = require('express');
const { authAdminToken } = require('../middleware/authToken');
const adminController = require('../controller/admin.controller');

const router = express.Router();

router.post('/get-all-users', authAdminToken, adminController.getAllUsers);
router.post('/del-user', authAdminToken, adminController.delUser);
router.post('/del-users', authAdminToken, adminController.delUsers);

module.exports = router;
