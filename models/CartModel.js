const { getDB } = require('../config/mongoDB');
const { ObjectId } = require('mongodb');
const Joi = require('joi');

const COLLECTION_NAME = 'carts';
const COLLECTION_SCHEMA = Joi.object({
    userId: Joi.string().required(),
    cartList: Joi.array().default([])
}).options({ abortEarly: false });

const addCart = async (userId, prodId) => {
    const db = getDB();
    try {
        const collection = db.collection(COLLECTION_NAME);
        
        // Check if the cart for this user already exists
        const existingCart = await collection.findOne({ userId });
        
        if (existingCart) {
            // If cart exists, update the cartList with the new prodId (if not already present)
            await collection.updateOne(
                { userId },
                { $addToSet: { cartList: prodId } }
            );
        } else {
            // If cart does not exist, create a new cart document
            await collection.insertOne({
                userId,
                cartList: [prodId]
            });
        }
    } catch (error) {
        console.error('Error adding cart item to database:', error);
        throw error;
    }
};

const getCarts = async (userId) => {
    const db = getDB();
    try {
        const collection = db.collection(COLLECTION_NAME);
        const cart = await collection.findOne({ userId });
        if (!cart) {
            return { cartList: [] }; // Return empty cart list if user has no cart
        }
        return cart;
    } catch (error) {
        console.error('Error fetching carts from database:', error);
        throw error;
    }
};

const delCart = async (userId, prodId) => {
    const db = getDB();
    try {
        const collection = db.collection(COLLECTION_NAME);
        await collection.updateOne(
            { userId },
            { $pull: { cartList: prodId } }
        );
    } catch (error) {
        console.error('Error deleting cart item from database:', error);
        throw error;
    }
};

const delCarts = async (userId, prodList) => {
    const db = getDB();
    try {
        const collection = db.collection(COLLECTION_NAME);
        await collection.updateOne(
            { userId },
            { $pull: { cartList: { $in: prodList } } }
        );
    } catch (error) {
        console.error('Error deleting cart items from database:', error);
        throw error;
    }
};

const delAllCart = async (userId) => {
    const db = getDB();
    try {
        const collection = db.collection(COLLECTION_NAME);
        await collection.updateOne(
            { userId },
            { $set: { cartList: [] } }
        );
    } catch (error) {
        console.error('Error deleting all cart items from database:', error);
        throw error;
    }
};

module.exports = {
    addCart,
    getCarts,
    delCart,
    delCarts,
    delAllCart
};
