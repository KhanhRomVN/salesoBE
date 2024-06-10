const { getDB } = require('../config/mongoDB');
const Joi = require('joi');
const { ObjectId } = require('mongodb');
const slugify = require('slugify'); // Thư viện để tạo slug

const COLLECTION_NAME = 'products';
const COLLECTION_SCHEMA = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    price: Joi.number().required(),
    discount: Joi.number().optional(),
    userId: Joi.string().required(),
    slug: Joi.string().required(), 
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date()),
}).options({ abortEarly: false });

const addProduct = async (productData) => {
    const slug = slugify(productData.name, { lower: true });

    const validatedProduct = await COLLECTION_SCHEMA.validateAsync({
        ...productData,
        slug
    });
    const db = getDB();
    const result = await db.collection(COLLECTION_NAME).insertOne(validatedProduct);
    return result;
}

const getProductsByUserId = async (userId) => {
    const db = getDB();
    const products = await db.collection(COLLECTION_NAME).find({ userId: userId }).toArray();
    return products;
}

const getProductsByType = async (type) => {
    const db = getDB();
    const products = await db.collection(COLLECTION_NAME).find({ type: type }).toArray();
    return products;
}


module.exports = {
    addProduct,
    getProductsByUserId,
    getProductsByType
};
