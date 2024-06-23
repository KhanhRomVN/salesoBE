const express = require('express');
const { authAdminToken } = require('../middleware/authToken');
const adminController = require('../controller/admin.controller');

const router = express.Router();

router.get('/get-all-users', authAdminToken, adminController.getAllUsers);

module.exports = router;
