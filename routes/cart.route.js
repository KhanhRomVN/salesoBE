const express = require('express')
const cartController = require('../controller/cart.controller')
const { authToken } = require('../middleware/authToken')

const router = express.Router()

//* Add a product to cart user
router.post('/add-cart', authToken, cartController.addCart)

//* Get all product from cart user
router.post('/get-carts', authToken, cartController.getListProductOfCart)

//* Delete a/many product from cart user
router.post('/del-cart', authToken, cartController.delCart)
router.post('/del-carts', authToken, cartController.delCarts)

module.exports = router