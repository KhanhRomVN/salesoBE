const UserModel = require('../models/UserModel');
const ProductModel = require('../models/ProductModel');

const addProduct = async (req, res) => {
    const { name, image, description, price, category, inventory } = req.body;
    const user_id = req.user._id.toString();

    try {
        const user = await UserModel.getUserById(user_id);
        if (!user) {
            return res.status(401).json({ error: 'Invalid User' });
        }
        
        if(user.role !== "seller") {
            return res.status(401).json({ error: 'Invalid Seller' });
        }

        const productData = {
            user_id,
            name,
            image,
            description,
            price,
            category,
            inventory
        };

        await ProductModel.addProduct(productData);
        res.status(201).json({ productData });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getProductByProductId = async (req, res) => {
    const { prod_id } = req.body
    try {
        const product = await ProductModel.getProductByProdId(prod_id);
        res.status(200).json({ product });
    } catch (error) {
        console.error("Error getting products by userId:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getListOfProductByUserId = async (req, res) => {
    const userId = req.user._id.toString();

    try {
        const products = await ProductModel.getProductsByUserId(userId);
        res.status(200).json({ products });
    } catch (error) {
        console.error("Error getting products by userId:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getListOfProductByTypeOfProduct = async (req, res) => {
    const { category } = req.body;

    try {
        const products = await ProductModel.getProductsByType(category);
        res.status(200).json({ products });
    } catch (error) {
        console.error("Error getting products by type:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const allProducts = await ProductModel.getAllProducts();
        res.status(200).json(allProducts);
    } catch (error) {
        console.error("Error getting products by type:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    addProduct,
    getProductByProductId,
    getListOfProductByTypeOfProduct,
    getListOfProductByUserId,
    getAllProducts
};
