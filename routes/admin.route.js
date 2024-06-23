const express = require('express');
const { authAdminToken } = require('../middleware/authToken');
const adminController = require('../controller/admin.controller');

const router = express.Router();

//* Get all user from collection 'users'
router.get('/get-all-users', authAdminToken, adminController.getAllUsers);

//! Get all products from collection 'products'

module.exports = router;
