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
const getProductByProductId = async (req, res) => {
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

const getListOfProductByUserId = async (req, res) => {
    const userId = req.user._id.toString();
    try {
        const products = await ProductModel.getProductsByUserId(userId);
        logger.info(`Retrieved products by userId: ${userId}`);
        res.status(200).json({ products });
    } catch (error) {
        logger.error('Error getting products by userId:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getListOfProductByCategory = async (req, res) => {
    const { category } = req.body;
    try {
        const products = await ProductModel.getProductsByCategory(category);
        logger.info(`Retrieved products by category: ${category}`);
        res.status(200).json({ products });
    } catch (error) {
        logger.error('Error getting products by category:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const allProducts = await ProductModel.getAllProducts();
        logger.info('Retrieved all products');
        res.status(200).json(allProducts);
    } catch (error) {
        logger.error('Error getting all products:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

//* Update Product
const updateName = async (req, res) => {
    const user_id = req.user._id.toString(); 
    const { prod_id, name } = req.body;
    try {
        await ProductModel.updateName(user_id, prod_id, name);
        logger.info(`Updated product name: ${prod_id}`);
        res.status(200).json({ message: "Product name updated successfully" });
    } catch (error) {
        logger.error('Error updating product name:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const updateImage = async (req, res) => {
    const user_id = req.user._id.toString(); 
    const { prod_id, image } = req.body;
    try {
        await ProductModel.updateImage(user_id, prod_id, image);
        logger.info(`Updated product image: ${prod_id}`);
        res.status(200).json({ message: "Product image updated successfully" });
    } catch (error) {
        logger.error('Error updating product image:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const updateDesc = async (req, res) => {
    const user_id = req.user._id.toString(); 
    const { prod_id, description } = req.body;
    try {
        await ProductModel.updateDesc(user_id, prod_id, description);
        logger.info(`Updated product description: ${prod_id}`);
        res.status(200).json({ message: "Product description updated successfully" });
    } catch (error) {
        logger.error('Error updating product description:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const updatePrice = async (req, res) => {
    const user_id = req.user._id.toString(); 
    const { prod_id, price } = req.body;
    try {
        await ProductModel.updatePrice(user_id, prod_id, price);
        logger.info(`Updated product price: ${prod_id}`);
        res.status(200).json({ message: "Product price updated successfully" });
    } catch (error) {
        logger.error('Error updating product price:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const updateCategory = async (req, res) => {
    const user_id = req.user._id.toString(); 
    const { prod_id, category } = req.body;
    try {
        await ProductModel.updateCategory(user_id, prod_id, category);
        logger.info(`Updated product category: ${prod_id}`);
        res.status(200).json({ message: "Product category updated successfully" });
    } catch (error) {
        logger.error('Error updating product category:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const updateInventory = async (req, res) => {
    const user_id = req.user._id.toString(); 
    const { prod_id, inventory } = req.body;
    try {
        await ProductModel.updateInventory(user_id, prod_id, inventory);
        logger.info(`Updated product inventory: ${prod_id}`);
        res.status(200).json({ message: "Product inventory updated successfully" });
    } catch (error) {
        logger.error('Error updating product inventory:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const updateStatus = async (req, res) => {
    const user_id = req.user._id.toString(); 
    const { prod_id, status } = req.body;
    try {
        await ProductModel.updateStatus(user_id, prod_id, status);
        logger.info(`Updated product status: ${prod_id}`);
        res.status(200).json({ message: "Product status updated successfully" });
    } catch (error) {
        logger.error('Error updating product status:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

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
    getProductByProductId,
    getListOfProductByCategory,
    getListOfProductByUserId,
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
