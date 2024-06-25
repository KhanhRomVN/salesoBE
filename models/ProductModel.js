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
        console.error("Error in getProductsByCategory: ", error);
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

//* Update Product
const updateName = async (user_id, prod_id, name) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne({ user_id, _id: new ObjectId(prod_id) }, { $set: { name, updatedAt: new Date() } });
    } catch (error) {
        console.error("Error in updateName: ", error);
        throw error;
    }
}

const updateImage = async (user_id, prod_id, image) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne({ user_id, _id: new ObjectId(prod_id) }, { $set: { image, updatedAt: new Date() } });
    } catch (error) {
        console.error("Error in updateImage: ", error);
        throw error;
    }
}

const updateDesc = async (user_id, prod_id, description) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne({ user_id, _id: new ObjectId(prod_id) }, { $set: { description, updatedAt: new Date() } });
    } catch (error) {
        console.error("Error in updateDesc: ", error);
        throw error;
    }
}

const updatePrice = async (user_id, prod_id, price) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne({ user_id, _id: new ObjectId(prod_id) }, { $set: { price, updatedAt: new Date() } });
    } catch (error) {
        console.error("Error in updatePrice: ", error);
        throw error;
    }
}

const updateCategory = async (user_id, prod_id, category) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne({ user_id, _id: new ObjectId(prod_id) }, { $set: { category, updatedAt: new Date() } });
    } catch (error) {
        console.error("Error in updateCategory: ", error);
        throw error;
    }
}

const updateInventory = async (user_id, prod_id, inventory) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne({ user_id, _id: new ObjectId(prod_id) }, { $set: { inventory, updatedAt: new Date() } });
    } catch (error) {
        console.error("Error in updateInventory: ", error);
        throw error;
    }
}

const updateStatus = async (user_id, prod_id, status) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne({ user_id, _id: new ObjectId(prod_id) }, { $set: { is_active: status, updatedAt: new Date() } });
    } catch (error) {
        console.error("Error in updateStatus: ", error);
        throw error;
    }
}

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
    getProductsByUserId,
    getProductsByCategory,
    getProductByProdId,
    getAllProducts,
    updateName,
    updateImage,
    updateDesc,
    updatePrice,
    updateCategory,
    updateInventory,
    updateStatus,
    deleteProduct,
    deleteListProduct
};
