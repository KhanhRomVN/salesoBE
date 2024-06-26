const express = require('express')
const reviewController = require('../controller/review.controller')
const { authToken } = require('../middleware/authToken')
const router = express.Router()

//* Add Review
router.post('/add-review', authToken, reviewController.addReview)

//* Get Review
router.post('/get-product-reviews', reviewController.getProductReviews)
router.post('/get-user-reviews', reviewController.getUserReviews)

//* Update Review
router.post('/update-comment', authToken, reviewController.updateComment)
router.post('/update-rate', authToken, reviewController.updateRate)

//* Delete Review (For Customer)
router.post('/del-review', authToken, reviewController.delReview)

module.exports = router