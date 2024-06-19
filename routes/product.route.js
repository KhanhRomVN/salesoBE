const express = require('express')
const productController = require('../controller/product.controller')
const { authToken } = require('../middleware/authToken')

const router = express.Router()

router.post('/add-product', authToken, productController.addProduct)
router.post('/get-product', productController.getProductByProductId)
router.post('/get-products', authToken, productController.getListOfProductByUserId)
router.post('/get-type-products', productController.getListOfProductByTypeOfProduct)
router.get('/get-all-products', productController.getAllProducts)

router.post('/get-reviews', productController.getReviews)
router.post('/comment-review', authToken, productController.commentReview)
router.post('/del-review', authToken, productController.delReview)


module.exports = router