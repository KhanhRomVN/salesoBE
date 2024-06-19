const { getDB } = require('../config/mongoDB');
const Joi = require('joi');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'reviews';
const COLLECTION_SCHEMA = Joi.object({
    prod_id: Joi.string().required(),
    user_id: Joi.string().required(),
    reviewComment: Joi.string().required(),
    created_at: Joi.date().required()
}).options({ abortEarly: false });

const getReviewsByProductId = async (prod_id) => {
    const db = getDB();
    try {
        const reviews = await db.collection(COLLECTION_NAME).find({ prod_id }).toArray();
        return reviews;
    } catch (error) {
        console.error("Error getting reviews by product id:", error);
        throw error;
    }
}

const addReview = async (reviewData) => {
    const db = getDB();
    try {
        const { error } = COLLECTION_SCHEMA.validate(reviewData);
        if (error) {
            throw new Error(`Invalid review data: ${error.message}`);
        }

        const result = await db.collection(COLLECTION_NAME).insertOne(reviewData);
        return result.insertedId;
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
}

const getReviewById = async (review_id) => {
    const db = getDB();
    try {
        const review = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(review_id) });
        return review;
    } catch (error) {
        console.error("Error getting review by id:", error);
        throw error;
    }
}

const deleteReview = async (review_id) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(review_id) });
    } catch (error) {
        console.error("Error deleting review:", error);
        throw error;
    }
}

module.exports = {
    getReviewsByProductId,
    addReview,
    getReviewById,
    deleteReview
};
