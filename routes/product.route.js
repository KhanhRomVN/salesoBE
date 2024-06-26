const express = require('express')
const productController = require('../controller/product.controller')
const { authToken } = require('../middleware/authToken')
const router = express.Router()

//* Add Product
router.post('/add-product', authToken, productController.addProduct)

//* Get Product
router.post('/get-product', productController.getProductByProductId)
router.post('/get-products', authToken, productController.getListOfProductByUserId)
router.post('/get-type-products', productController.getListOfProductByCategory)
router.post('/get-all-products', productController.getAllProducts)

//* Update Product
router.post('/update-name', productController.updateName)
router.post('/update-image', productController.updateImage)
router.post('/update-desc', productController.updateDesc)
router.post('/update-price', productController.updatePrice)
router.post('/update-category', productController.updateCategory)
router.post('/update-inventory', productController.updateInventory)
router.post('/update-status', productController.updateStatus)

//* Delete Product
router.post('/del-product', productController.deleteProduct)
router.post('/del-list-product', productController.deleteListProduct)

module.exports = router