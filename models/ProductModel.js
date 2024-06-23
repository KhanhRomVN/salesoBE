const { getDB } = require('../config/mongoDB');
const Joi = require('joi');
const { ObjectId } = require('mongodb');
const slugify = require('slugify');

const COLLECTION_NAME = 'products';
const COLLECTION_SCHEMA = Joi.object({
    user_id: Joi.string().required(),
    name: Joi.string().required(),
    slug: Joi.string().required(), 
    image: Joi.string().required(),
    description: Joi.string().required(), 
    price: Joi.number().required(),
    category: Joi.string().required(),
    inventory: Joi.number().required(),
    units_sold: Joi.number().default(0),
    is_active: Joi.string().valid('yes', 'no').default('yes'),
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date()),
}).options({ abortEarly: false });

const addProduct = async (productData) => {
    const db = getDB();

    try {
        const slug = slugify(productData.name, { lower: true });
        const validatedProduct = await COLLECTION_SCHEMA.validateAsync({
            ...productData,
            slug
        });

        const result = await db.collection(COLLECTION_NAME).insertOne(validatedProduct);
        return result;
    } catch (error) {
        console.error("Error in addProduct: ", error);
        throw error;
    }
}

const getProductsByUserId = async (user_id) => {
    const db = getDB();
    try {
        const products = await db.collection(COLLECTION_NAME).find({ user_id: user_id }).toArray();
        return products;
    } catch (error) {
        console.error("Error in getProductsByUserId: ", error);
        throw error;
    }
}

const getProductsByCategory = async (category) => {
    const db = getDB();
    try {
        const products = await db.collection(COLLECTION_NAME).find({ category: category }).toArray();
        return products;
    } catch (error) {
        console.error("Error in getProductsByType: ", error);
        throw error;
    }
    
}

const getProductByProdId = async (prod_id) => {
    const db = getDB();
    try {
        const product = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(prod_id) });
        return product;
    } catch (error) {
        console.error("Error in getProductByProdId: ", error);
        throw error;
    }
}

const getAllProducts = async () => {
    const db = getDB();
    try {
        const allProducts = await db.collection(COLLECTION_NAME).find({}).toArray();
        return allProducts;
    } catch (error) {
        console.error("Error in getAllProducts: ", error);
        throw error;
    }
}


module.exports = {
    addProduct,
    getProductsByUserId,
    getProductsByCategory,
    getProductByProdId,
    getAllProducts
};
