const express = require('express')
// const loginUser = require('../controller/registerUser')
const logout = require('../controller/authController/logout.controller')
const registerController = require('../controller/authController/register.controller')

const router = express.Router()

router.post('/register', registerController)
// router.post('/login',registerUser)
router.get('/logout',logout)

module.exports = router