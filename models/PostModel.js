const { getDB } = require('../config/mongoDB');
const Joi = require('joi');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'posts';
const COLLECTION_SCHEMA = Joi.object({
    user_id: Joi.string().required(),
    group_id: Joi.string().allow(''),
    content: Joi.string().required(),
    image: Joi.string().allow(''),
    like: Joi.array().items(Joi.object({
        user_id: Joi.string().required(),
        username: Joi.string().required()
    })),
    share: Joi.array().items(Joi.object({
        user_id: Joi.string().required(),
        username: Joi.string().required()
    })),
    comment: Joi.array().items(String()),
    create_at: Joi.date().required(),
    update_at: Joi.date().required(),
    status: Joi.string().valid('public', 'private').required()
}).options({ abortEarly: false });

const validatePostData = (postData) => {
    const validation = COLLECTION_SCHEMA.validate(postData);
    if (validation.error) {
        throw new Error(validation.error.details.map(detail => detail.message).join(', '));
    }
};

const createPost = async (postData) => {
    validatePostData(postData);
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).insertOne(postData);
    } catch (error) {
        throw new Error('Error creating post');
    }
}

const deletePost = async (post_id) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(post_id) });
    } catch (error) {
        throw new Error('Error deleting post');
    }
}

const setStatus = async (post_id, status) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(post_id) },
            { $set: { status, update_at: new Date() } }
        );
    } catch (error) {
        throw new Error('Error setting post status');
    }
}

const updateContent = async (post_id, postContent) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(post_id) },
            { $set: { content: postContent, update_at: new Date() } }
        );
    } catch (error) {
        throw new Error('Error updating post content');
    }
}

const updateImage = async (post_id, postImage) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: ObjectId(post_id) },
            { $set: { image: postImage, update_at: new Date() } }
        );
    } catch (error) {
        throw new Error('Error updating post image');
    }
}

const getPostByPostId = async (post_id) => {
    const db = getDB();
    try {
        const post = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(post_id) });
        return post;
    } catch (error) {
        throw new Error('Error getting post');
    }
}

const getListPostByUserId = async (user_id) => {
    const db = getDB();
    try {
        const posts = await db.collection(COLLECTION_NAME)
            .find({ user_id: user_id })
            .sort({ create_at: -1 })
            .toArray();
        return posts;
    } catch (error) {
        throw new Error('Error getting posts by user id');
    }
}

const getListPostByGroupId = async (group_id) => {
    const db = getDB();
    try {
        const posts = await db.collection(COLLECTION_NAME)
            .find({ group_id: group_id })
            .sort({ create_at: -1 })
            .toArray();
        return posts;
    } catch (error) {
        throw new Error('Error getting posts by group id');
    }
}

const likePost = async (post_id, user) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(post_id) },
            { $addToSet: { like: user }, $set: { update_at: new Date() } }
        );
    } catch (error) {
        throw new Error('Error liking post');
    }
};

const unLikePost = async (post_id, user_id) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(post_id) },
            { $pull: { like: { user_id } }, $set: { update_at: new Date() } }
        );
    } catch (error) {
        throw new Error('Error unliking post');
    }
};

const sharePost = async (original_post_id, user_id, share_data) => {
    const db = getDB();
    try {
        const originalPost = await db.collection(COLLECTION_NAME).findOne({ _id: ObjectId(original_post_id) });
        if (!originalPost) {
            throw new Error('Original post not found');
        }
        const newPostData = {
            ...share_data,
            shared: true,
            shared_from: {
                post_id: originalPost._id,
                user_id: originalPost.user_id,
                content: originalPost.content,
                image: originalPost.image,
                create_at: originalPost.create_at
            },
            user_id: user_id,
            create_at: new Date(),
            update_at: new Date()
        };
        await db.collection(COLLECTION_NAME).insertOne(newPostData);
    } catch (error) {
        throw new Error('Error sharing post');
    }
};

module.exports = {
    createPost,
    deletePost,
    setStatus,
    updateContent,
    updateImage,
    getPostByPostId,
    getListPostByUserId,
    getListPostByGroupId,
    likePost,
    unLikePost,
    sharePost,
};
