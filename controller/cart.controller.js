const CartModel = require('../models/CartModel');
const ProductModel = require('../models/ProductModel');

const addCart = async (req, res) => {
    const { prod_id } = req.body;
    const user_id = req.user._id.toString();
    try {
        await CartModel.addCart(user_id, prod_id);
        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getListProductOfCart = async (req, res) => {
    const user_id = req.user._id.toString();
    try {
        const cartList = await CartModel.getListProductOfCart(user_id);
        const productList = [];
        for (let i = 0; i < cartList.length; i++) {
            const prod_id = cartList[i];
            const productData = await ProductModel.getProductByProdId(prod_id);
            productList.push(productData);
        }
        res.status(200).json({productList: productList});
    } catch (error) {
        console.error('Error fetching carts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const delCart = async (req, res) => {
    const { prod_id } = req.body;
    const user_id = req.user._id.toString();
    try {
        await CartModel.delCart(user_id, prod_id);
        res.status(200).json({ message: 'Product deleted from cart successfully' });
    } catch (error) {
        console.error('Error deleting product from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const delCarts = async (req, res) => {
    const { prodList } = req.body;
    const user_id = req.user._id.toString();
    try {
        await CartModel.delCarts(user_id, prodList);
        res.status(200).json({ message: 'Products deleted from cart successfully' });
    } catch (error) {
        console.error('Error deleting products from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addCart,
    getListProductOfCart,
    delCart,
    delCarts,
};
