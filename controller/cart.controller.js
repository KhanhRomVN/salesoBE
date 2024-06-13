const CartModel = require('../models/CartModel');

const addCart = async (req, res) => {
    const { prodId } = req.body;
    const userId = req.user._id.toString();

    try {
        await CartModel.addCart(userId, prodId);
        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getCarts = async (req, res) => {
    const userId = req.user._id.toString();

    try {
        const carts = await CartModel.getCarts(userId);
        res.status(200).json({ carts });
    } catch (error) {
        console.error('Error fetching carts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const delCart = async (req, res) => {
    const { prodId } = req.body;
    const userId = req.user._id.toString();

    try {
        await CartModel.delCart(userId, prodId);
        res.status(200).json({ message: 'Product deleted from cart successfully' });
    } catch (error) {
        console.error('Error deleting product from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const delCarts = async (req, res) => {
    const { prodList } = req.body;
    const userId = req.user._id.toString();

    try {
        await CartModel.delCarts(userId, prodList);
        res.status(200).json({ message: 'Products deleted from cart successfully' });
    } catch (error) {
        console.error('Error deleting products from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const delAllCart = async (req, res) => {
    const userId = req.user._id.toString();

    try {
        await CartModel.delAllCart(userId);
        res.status(200).json({ message: 'All products deleted from cart successfully' });
    } catch (error) {
        console.error('Error deleting all products from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addCart,
    getCarts,
    delCart,
    delCarts,
    delAllCart
};
