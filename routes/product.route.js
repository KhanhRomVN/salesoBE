const express = require('express')
const productController = require('../controller/product.controller')
const { authToken } = require('../middleware/authToken')
const router = express.Router()

//* Add Product
router.post('/add-product', authToken, productController.addProduct)

//* Get Product
router.post('/get-product-by-prod-id', productController.getProductByProdId)
router.post('/get-list-product-by-user-id', authToken, productController.getListProductByUserId)
router.post('/get-list-product-by-category', productController.getListProductByCategory)
router.post('/get-all-product', productController.getAllProduct)

//* Update Product
router.post('/update-product', authToken, productController.updateProduct)
router.post('/update-status', authToken, productController.updateStatus)
router.post('/add-inventory', authToken, productController.updateInventory)

//* Delete Product
router.post('/del-product-by-prod-id', authToken, productController.deleteProduct)
router.post('/del-list-product-by-list-prod-id', authToken, productController.deleteListProduct)

module.exports = router