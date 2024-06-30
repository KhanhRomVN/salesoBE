const { getDB } = require('../config/mongoDB');
const Joi = require('joi');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'comments';
const COLLECTION_SCHEMA = Joi.object({
    user_id: Joi.string().required(),
    post_id: Joi.string().required(),
    content: Joi.string().required(),
    image: Joi.string().allow(''),
    like: Joi.array().items(Joi.object({
        user_id: Joi.string().required(),
        username: Joi.string().required()
    })),
    create_at: Joi.date().required(),
    update_at: Joi.date().required(),
}).options({ abortEarly: false });

const validatePostData = (postData) => {
    const validation = COLLECTION_SCHEMA.validate(postData);
    if (validation.error) {
        throw new Error(validation.error.details.map(detail => detail.message).join(', '));
    }
};

//* Create Comment
const createComment = async (user_id, commentData) => {
    const db = getDB();
    try {
        validatePostData({ ...commentData, user_id });
        await db.collection(COLLECTION_NAME).insertOne({
            user_id: user_id,
            ...commentData,
        });
    } catch (error) {
        throw new Error(`Create comment failed: ${error.message}`);
    }
};

//* Delete Comment
const deleteComment = async (comment_id) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(comment_id) });
    } catch (error) {
        throw new Error(`Delete comment failed: ${error.message}`);
    }
};


//* Update Comment Content
const updateContent = async (comment_id, content) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(comment_id) },
            { $set: { content, update_at: new Date() } }
        );
    } catch (error) {
        throw new Error(`Update content failed: ${error.message}`);
    }
};

//* Update Comment Image
const updateImage = async (comment_id, image) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(comment_id) },
            { $set: { image, update_at: new Date() } }
        );
    } catch (error) {
        throw new Error(`Update image failed: ${error.message}`);
    }
};

//* Delete Comment Image
const delImage = async (comment_id) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(comment_id) },
            { $unset: { image: '' }, $set: { update_at: new Date() } }
        );
    } catch (error) {
        throw new Error(`Delete image failed: ${error.message}`);
    }
};

const getCommentByCommentId = async (comment_id) => {
    const db = getDB();
    try {
        const comment = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(comment_id) });
        return comment;
    } catch (error) {
        throw new Error(`Get comment by id failed: ${error.message}`);
    }
};

const getListCommentByPostId = async (post_id) => {
    const db = getDB();
    try {
        const comments = await db.collection(COLLECTION_NAME).find({ post_id }).toArray();
        return comments;
    } catch (error) {
        throw new Error(`Get list comment by post id failed: ${error.message}`);
    }
};

module.exports = {
    createComment,
    deleteComment,
    updateContent,
    updateImage,
    delImage,
    getCommentByCommentId,
    getListCommentByPostId
};
