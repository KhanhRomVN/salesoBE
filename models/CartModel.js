const { getDB } = require('../config/mongoDB');
const Joi = require('joi');

const COLLECTION_NAME = 'carts';
const COLLECTION_SCHEMA = Joi.object({
    userId: Joi.string().required(),
    cartList: Joi.array().default([])
}).options({ abortEarly: false });

const addCart = async (user_id, prod_id) => {
    console.log(user_id, prod_id);
    const db = getDB();
    try {
        const collection = db.collection(COLLECTION_NAME);
        
        const existingCart = await collection.findOne({ user_id });
        
        if (existingCart) {
            await collection.updateOne(
                { user_id },
                { $addToSet: { cartList: prod_id } }
            );
        } else {
            await collection.insertOne({
                user_id,
                cartList: [prod_id]
            });
        }
    } catch (error) {
        console.error('Error adding cart item to database:', error);
        throw error;
    }
};

const getListProductOfCart = async (user_id) => {
    const db = getDB();
    try {
        const collection = db.collection(COLLECTION_NAME);
        const carts = await collection.findOne({ user_id });
        if (!carts) {
            return { cartList: [] }; 
        }
        const cartList = carts.cartList
        return cartList
    } catch (error) {
        console.error('Error fetching carts from database:', error);
        throw error;
    }
};

const delCart = async (user_id, prod_id) => {
    const db = getDB();
    try {
        const collection = db.collection(COLLECTION_NAME);
        await collection.updateOne(
            { user_id },
            { $pull: { cartList: prod_id } }
        );
    } catch (error) {
        console.error('Error deleting cart item from database:', error);
        throw error;
    }
};

const delCarts = async (user_id, productList) => {
    const db = getDB();
    try {
        const collection = db.collection(COLLECTION_NAME);
        await collection.updateOne(
            { user_id },
            { $pull: { cartList: { $in: productList } } }
        );
    } catch (error) {
        console.error('Error deleting cart items from database:', error);
        throw error;
    }
};

module.exports = {
    addCart,
    getListProductOfCart,
    delCart,
    delCarts,
};
