const express = require('express')
const cartController = require('../controller/cart.controller')
const { authToken } = require('../middleware/authToken')

const router = express.Router()

router.post('/add-cart', authToken, cartController.addCart)
router.post('/carts', authToken, cartController.getCarts)
router.post('/del-cart', authToken, cartController.delCart)
router.post('/del-carts', authToken, cartController.delCarts)
router.post('/del-all-cart', authToken, cartController.delAllCart)

module.exports = router