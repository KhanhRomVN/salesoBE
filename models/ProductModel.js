const { getDB } = require('../config/mongoDB');
const Joi = require('joi');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'products';
const COLLECTION_SCHEMA = Joi.object({
    user_id: Joi.string().required(),
    name: Joi.string().required(),
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

//* Add Product
const addProduct = async (productData) => {
    const db = getDB();
    try {
        const validatedProduct = await COLLECTION_SCHEMA.validateAsync(productData);
        await db.collection(COLLECTION_NAME).insertOne(validatedProduct);
    } catch (error) {
        console.error("Error in addProduct: ", error);
        throw error;
    }
}

//* Get Product
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

const getListProductByUserId = async (user_id) => {
    const db = getDB();
    try {
        const products = await db.collection(COLLECTION_NAME).find({ user_id: user_id }).toArray();
        return products;
    } catch (error) {
        console.error("Error in getProductsByUserId: ", error);
        throw error;
    }
}

const getListProductByCategory = async (category) => {
    const db = getDB();
    try {
        const products = await db.collection(COLLECTION_NAME).find({ category: category }).toArray();
        return products;
    } catch (error) {
        console.error("Error in getProductsByCategory: ", error);
        throw error;
    }
}

const getAllProduct = async () => {
    const db = getDB();
    try {
        const allProducts = await db.collection(COLLECTION_NAME).find({}).toArray();
        return allProducts;
    } catch (error) {
        console.error("Error in getAllProducts: ", error);
        throw error;
    }
}

//* Update Product
const updateProduct = async (prod_id, productData) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(prod_id) },
            { $set: { ...productData, updatedAt: new Date() } }
        );
    } catch (error) {
        console.error("Error in updateProduct: ", error);
        throw error;
    }
};

const updateStatus = async (prod_id, status) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(prod_id) },
            { $set: { is_active: status, updatedAt: new Date() } }
        );
    } catch (error) {
        console.error("Error in updateStatus: ", error);
        throw error;
    }
};

const updateInventory = async (prod_id, inventoryAdd) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(prod_id) },
            { $inc: { inventory: inventoryAdd }, $set: { updatedAt: new Date() } }
        );
    } catch (error) {
        console.error("Error in updateInventory: ", error);
        throw error;
    }
};

//* Delete Product
const deleteProduct = async (user_id, prod_id) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).deleteOne({ user_id, _id: new ObjectId(prod_id) });
    } catch (error) {
        console.error("Error in deleteProduct: ", error);
        throw error;
    }
}

const deleteListProduct = async (user_id, list_prod_id) => {
    const db = getDB();
    try {
        const prod_ids = list_prod_id.map(id => new ObjectId(id));
        await db.collection(COLLECTION_NAME).deleteMany({ user_id, _id: { $in: prod_ids } });
    } catch (error) {
        console.error("Error in deleteListProduct: ", error);
        throw error;
    }
}

module.exports = {
    addProduct,
    getProductByProdId,
    getListProductByUserId,
    getListProductByCategory,
    getAllProduct,
    updateProduct,
    updateStatus,
    updateInventory,
    deleteProduct,
    deleteListProduct
};
