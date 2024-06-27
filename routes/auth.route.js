const express = require('express');
const authController = require('../controller/auth.controller');
const { authToken } = require('../middleware/authToken');
const router = express.Router();

//* Register 
router.post('/email-verify', authController.emailVerify);
router.post('/register-otp', authController.registerUserWithOTP);

//* Login
router.post('/login', authController.loginUser);
router.post('/login/google', authController.loginGoogleUser);

//* Logout
router.post('/logout', authToken, authController.logoutUser);

module.exports = router;