const express = require('express');
const authController = require('../controller/auth.controller');
const { authToken } = require('../middleware/authToken');

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/confirmation', authController.confirmEmail);
router.post('/login', authController.loginUser);
router.post('/login/google', authController.loginGoogleUser);
router.post('/logout', authToken, authController.logoutUser);

module.exports = router;