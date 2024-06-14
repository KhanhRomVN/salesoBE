const express = require('express')
const productController = require('../controller/product.controller')
const { authToken } = require('../middleware/authToken')

const router = express.Router()

router.post('/add-product', authToken, productController.addProduct)
router.post('/get-product', productController.getProductByProductId)
router.post('/get-products', authToken, productController.getListOfProductByUserId)
router.post('/get-type-products', productController.getListOfProductByTypeOfProduct)

module.exports = router