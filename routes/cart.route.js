const express = require('express')
const cartController = require('../controller/cart.controller')
const { authToken } = require('../middleware/authToken')
const router = express.Router()

//* Get Cart
router.post('/get-carts', authToken, cartController.getListProductOfCart)

//* Add Cart
router.post('/add-cart', authToken, cartController.addCart)

//* Del Cart
router.post('/del-cart', authToken, cartController.delCart)
router.post('/del-carts', authToken, cartController.delCarts)

module.exports = router