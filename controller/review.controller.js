const ReviewModel = require('../models/ReviewModel');
const logger = require('../config/logger');

const addReview = async (req, res) => {
    const userId = req.user._id.toString();
    const { prod_id, comment, rate } = req.body;
    try {
        const reviewData = {
            prod_id,
            user_id: userId,
            comment,
            rate
        };
        await ReviewModel.addReview(reviewData);
        logger.info(`Review added successfully by user: ${userId}`);
        res.status(201).json({ message: "Review added successfully" });
    } catch (error) {
        logger.error('Error adding review:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getProductReviews = async (req, res) => {
    const { prod_id } = req.body;
    try {
        const reviews = await ReviewModel.getReviewsByProductId(prod_id);
        logger.info(`Retrieved reviews for product: ${prod_id}`);
        res.status(200).json(reviews);
    } catch (error) {
        logger.error('Error getting product reviews:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getUserReviews = async (req, res) => {
    const { user_id } = req.body;
    try {
        const reviews = await ReviewModel.getReviewsByUserId(user_id);
        logger.info(`Retrieved reviews for user: ${user_id}`);
        res.status(200).json(reviews);
    } catch (error) {
        logger.error('Error getting user reviews:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const updateComment = async (req, res) => {
    const { review_id, comment } = req.body;
    try {
        await ReviewModel.updateComment(review_id, comment);
        logger.info(`Updated comment for review: ${review_id}`);
        res.status(200).json({ message: "Comment updated successfully" });
    } catch (error) {
        logger.error('Error updating comment:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const updateRate = async (req, res) => {
    const { review_id, rate } = req.body;
    try {
        await ReviewModel.updateRate(review_id, rate);
        logger.info(`Updated rate for review: ${review_id}`);
        res.status(200).json({ message: "Rate updated successfully" });
    } catch (error) {
        logger.error('Error updating rate:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const delReview = async (req, res) => {
    const { review_id } = req.body;
    try {
        await ReviewModel.delReview(review_id);
        logger.info(`Deleted review: ${review_id}`);
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        logger.error('Error deleting review:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    addReview,
    getProductReviews,
    getUserReviews,
    updateComment,
    updateRate,
    delReview
};
