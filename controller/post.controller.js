const logger = require('../config/logger');
const PostModel = require('../models/PostModel')
const UserModel = require('../models/UserModel')

//! Owner 
//* Create & Delete & Set Status & Update 
const createPost = async (req, res) => {
    const { content, image, status } = req.body;
    const user_id = req.user._id.toString()
    try {
        const postData = {
            user_id,
            content,
            status,
            like: [],
            share: [],
            create_at: new Date(),
            update_at: new Date()
        };

        if (image) {
            postData.image = image;
        }

        await PostModel.createPost(postData);
        res.status(201).json({ message: 'Create Post Successfully!' });
    } catch (error) {
        logger.error('Error creating post:', error);
        res.status(500).json({ success: false, message: 'Error creating post' });
    }
}


const deletePost = async (req, res) => {
    const { post_id } = req.body;
    try {
        await PostModel.deletePost(post_id);
        res.status(200).json({ success: true, message: 'Post deleted' });
    } catch (error) {
        logger.error('Error deleting post:', error);
        res.status(500).json({ success: false, message: 'Error deleting post' });
    }
}

const setStatus = async (req, res) => {
    const { post_id, status } = req.body;
    try {
        await PostModel.setStatus(post_id, status);
        res.status(200).json({ success: true, message: 'Status updated' });
    } catch (error) {
        logger.error('Error setting status:', error);
        res.status(500).json({ success: false, message: 'Error setting status' });
    }
}

const updatePost = async (req, res) => {
    const { post_id, content, image } = req.body;
    try {
        if (content) {
            await PostModel.updateContent(post_id, content);
        }
        if (image) {
            await PostModel.updateImage(post_id, image);
        }
        res.status(200).json({ success: true, message: 'Post updated' });
    } catch (error) {
        logger.error('Error updating post:', error);
        res.status(500).json({ success: false, message: 'Error updating post' });
    }
}

//* Get Post
const getPostByPostId = async (req, res) => {
    const { post_id } = req.body;
    try {
        const post = await PostModel.getPostByPostId(post_id);
        res.status(200).json({ success: true, post });
    } catch (error) {
        logger.error('Error getting post:', error);
        res.status(500).json({ success: false, message: 'Error getting post' });
    }
}

const getListPostByUserId = async (req, res) => {
    const user_id = req.user._id.toString();
    try {
        const posts = await PostModel.getListPostByUserId(user_id);
        res.status(200).json({ posts });
    } catch (error) {
        logger.error('Error getting posts by user id:', error);
        res.status(500).json({ success: false, message: 'Error getting posts by user id' });
    }
}

const getListPostByGroupId = async (req, res) => {
    const { group_id } = req.body;
    try {
        const posts = await PostModel.getListPostByGroupId(group_id);
        res.status(200).json({ success: true, posts });
    } catch (error) {
        logger.error('Error getting posts by group id:', error);
        res.status(500).json({ success: false, message: 'Error getting posts by group id' });
    }
}

//* Interact Post
const likePost = async (req, res) => {
    const { post_id } = req.body;
    const user_id = req.user._id.toString()
    try {
        const userData = await UserModel.getUserById(user_id)
        const username = userData.username
        const user = {
            user_id, 
            username
        }
        await PostModel.likePost(post_id, user);
        res.status(200).json({ success: true, message: 'Post liked' });
    } catch (error) {
        logger.error('Error liking post:', error);
        res.status(500).json({ success: false, message: 'Error liking post' });
    }
};

const unLikePost = async (req, res) => {
    const { post_id } = req.body;
    const user_id = req.user._id.toString();
    try {
        await PostModel.unLikePost(post_id, user_id);
        res.status(200).json({ success: true, message: 'Post unliked' });
    } catch (error) {
        logger.error('Error unliking post:', error);
        res.status(500).json({ success: false, message: 'Error unliking post' });
    }
};

const sharePost = async (req, res) => {
    const { post_id, content, image } = req.body;
    const user_id = req.user._id;
    const username = req.user.username;
    try {
        await PostModel.sharePost(post_id, user_id, { content, image, username });
        res.status(201).json({ success: true, message: 'Post shared' });
    } catch (error) {
        logger.error('Error sharing post:', error);
        res.status(500).json({ success: false, message: 'Error sharing post' });
    }
};

module.exports = {
    createPost,
    deletePost,
    setStatus,
    updatePost,
    getPostByPostId,
    getListPostByUserId,
    getListPostByGroupId,
    likePost,
    unLikePost,
    sharePost,
};
