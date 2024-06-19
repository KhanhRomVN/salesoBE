const UserModel = require('../models/UserModel');
const ProductModel = require('../models/ProductModel');
const ReviewModel = require('../models/ReviewModel');

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
    const { prod_id } = req.body;
    try {
        const product = await ProductModel.getProductByProdId(prod_id);
        res.status(200).json({ product });
    } catch (error) {
        console.error("Error getting product by prod_id:", error);
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
        console.error("Error getting all products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getReviews = async (req, res) => {
    const { prod_id } = req.body;
    try {
        const reviews = await ReviewModel.getReviewsByProductId(prod_id);
        res.status(200).json({ reviews });
    } catch (error) {
        console.error("Error getting reviews:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const commentReview = async (req, res) => {
    const { prod_id, reviewComment } = req.body;
    const userId = req.user._id.toString();
    try {
        const reviewData = {
            prod_id,
            user_id: userId,
            reviewComment,
            created_at: new Date()
        };

        await ReviewModel.addReview(reviewData);
        res.status(201).json({ reviewData });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const delReview = async (req, res) => {
    const { review_id } = req.body;
    const userId = req.user._id.toString();
    try {
        const review = await ReviewModel.getReviewById(review_id);

        if (!review || review.user_id !== userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        await ReviewModel.deleteReview(review_id);
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    addProduct,
    getProductByProductId,
    getListOfProductByTypeOfProduct,
    getListOfProductByUserId,
    getAllProducts,
    getReviews,
    commentReview,
    delReview
};
