const express = require('express')
const registerUser = require('../controller/authController/register.controller')
const loginUser = require('../controller/authController/login.controller')
const logoutUser = require('../controller/authController/logout.controller')
const authToken = require('../middleware/authToken')

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', authToken, logoutUser)

module.exports = router