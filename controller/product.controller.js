const UserModel = require('../models/UserModel');
const ProductModel = require('../models/ProductModel');

const addProduct = async (req, res) => {
    const { name, type, price, discount } = req.body;
    const userId = req.user._id.toString();

    try {
        const user = await UserModel.getUserById(userId);
        if (!user) {
            return res.status(401).json({ error: 'Invalid userId' });
        }
        
        if(user.role !== "seller") {
            return res.status(401).json({ error: 'Invalid Seller' });
        }

        const productData = {
            userId,
            name,
            type,
            price,
            discount
        };

        await ProductModel.addProduct(productData);
        res.status(201).json({ productData });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getProductsByType = async (req, res) => {
    const { type } = req.body;

    try {
        const products = await ProductModel.getProductsByType(type);
        res.status(200).json({ products });
    } catch (error) {
        console.error("Error getting products by type:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getProductsByUserId = async (req, res) => {
    const userId = req.user._id.toString();

    try {
        const products = await ProductModel.getProductsByUserId(userId);
        res.status(200).json({ products });
    } catch (error) {
        console.error("Error getting products by userId:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    addProduct,
    getProductsByType,
    getProductsByUserId
};
