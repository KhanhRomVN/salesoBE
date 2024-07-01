const UserModel = require('../models/UserModel');
const ProductModel = require('../models/ProductModel');
const logger = require('../config/logger');

//* Add Product
const addProduct = async (req, res) => {
    const { name, image, description, price, category, inventory } = req.body;
    const user_id = req.user._id.toString();

    try {
        const user = await UserModel.getUserById(user_id);
        if (!user) {
            logger.warn(`Invalid User tried to add product: ${user_id}`);
            return res.status(401).json({ error: 'Invalid User' });
        }
        
        if(user.role !== "seller") {
            logger.warn(`Non-seller user tried to add product: ${user_id}`);
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
        logger.info(`Product added successfully: ${name}`);
        res.status(201).json({ productData });
    } catch (error) {
        logger.error('Error adding product:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

//* Get Product
const getProductByProdId = async (req, res) => {
    const { prod_id } = req.body;
    try {
        const product = await ProductModel.getProductByProdId(prod_id);
        logger.info(`Retrieved product by prod_id: ${prod_id}`);
        res.status(200).json({ product });
    } catch (error) {
        logger.error('Error getting product by prod_id:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getListProductByUserId = async (req, res) => {
    const userId = req.user._id.toString();
    try {
        const products = await ProductModel.getListProductByUserId(userId);
        logger.info(`Retrieved products by userId: ${userId}`);
        res.status(200).json({ products });
    } catch (error) {
        logger.error('Error getting products by userId:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getListProductByCategory = async (req, res) => {
    const { category } = req.body;
    try {
        const products = await ProductModel.getListProductByCategory(category);
        logger.info(`Retrieved products by category: ${category}`);
        res.status(200).json({ products });
    } catch (error) {
        logger.error('Error getting products by category:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getAllProduct = async (req, res) => {
    try {
        const allProducts = await ProductModel.getAllProduct();
        logger.info('Retrieved all products');
        res.status(200).json(allProducts);
    } catch (error) {
        logger.error('Error getting all products:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

//* Update Product
const updateProduct = async (req, res) => {
    const { prod_id, name, image, description, price, category } = req.body;
    try {
        const productData = {};
        if (name) productData.name = name;
        if (image) productData.image = image;
        if (description) productData.description = description;
        if (price) productData.price = price;
        if (category) productData.category = category;

        await ProductModel.updateProduct(prod_id, productData);
        logger.info(`Updated product: ${prod_id}`);
        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        logger.error('Error updating product:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateStatus = async (req, res) => {
    const { prod_id, status } = req.body;
    console.log(prod_id);
    console.log(status);
    try {
        await ProductModel.updateStatus(prod_id, status);
        logger.info(`Updated status for product: ${prod_id}`);
        res.status(200).json({ message: "Product status updated successfully" });
    } catch (error) {
        logger.error('Error updating product status:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const updateInventory = async (req, res) => {
    const { prod_id, inventoryAdd } = req.body;
    try {
        await ProductModel.updateInventory(prod_id, inventoryAdd);
        logger.info(`Updated inventory for product: ${prod_id}`);
        res.status(200).json({ message: "Product inventory updated successfully" });
    } catch (error) {
        logger.error('Error updating product inventory:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//* Delete Product
const deleteProduct = async (req, res) => {
    const user_id = req.user._id.toString(); 
    const { prod_id } = req.body;
    try {
        await ProductModel.deleteProduct(user_id, prod_id);
        logger.info(`Deleted product: ${prod_id}`);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        logger.error('Error deleting product:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const deleteListProduct = async (req, res) => {
    const user_id = req.user._id.toString(); 
    const { list_prod_id } = req.body;
    try {
        await ProductModel.deleteListProduct(user_id, list_prod_id);
        logger.info(`Deleted products: ${list_prod_id}`);
        res.status(200).json({ message: "Products deleted successfully" });
    } catch (error) {
        logger.error('Error deleting products:', error);
        res.status(500).json({ error: "Internal Server Error" });
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
