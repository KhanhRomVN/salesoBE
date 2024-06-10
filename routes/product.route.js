const express = require('express')
const productController = require('../controller/product.controller')
const authToken = require('../middleware/authToken')

const router = express.Router()

// Thêm Product từ Seller
router.post('/add-product', authToken, productController.addProduct)
// Lấy toàn bộ Product từ Seller ID
router.post('/products', authToken, productController.getProductsByUserId)
// Lấy toàn bộ Product từ Type Product
router.post('/productstype', authToken, productController.getProductsByType)

module.exports = router