const express = require('express')
const productController = require('../controller/product.controller')
const { authToken } = require('../middleware/authToken')
const router = express.Router()

//* Add a product 
router.post('/add-product', authToken, productController.addProduct)

//* Get product detail
router.post('/get-product', productController.getProductByProductId)

//* Get list products from user
router.post('/get-products', authToken, productController.getListOfProductByUserId)

//* Get list products from category
router.post('/get-type-products', productController.getListOfProductByCategory)

//! Get all products (Should Admin Route)
router.get('/get-all-products', productController.getAllProducts)

//* Get reviews from a product
router.post('/get-reviews', productController.getReviews)

//* Comment a review to product
router.post('/comment-review', authToken, productController.commentReview)

//! Delete a review (don't code yet)
router.post('/del-review', authToken, productController.delReview)

module.exports = router