const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/mongoDB');

const COLLECTION_NAME = 'users';

const COLLECTION_SCHEMA = Joi.object({
    username: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    role: Joi.string().valid('admin', 'seller', 'customer').default('customer'),
    register_at: Joi.date().required(),
    last_login: Joi.date().default(() => new Date()),
    update_at: Joi.date().default(() => new Date()),
    refreshToken: Joi.string().default(""),
    emailConfirmed: Joi.string().valid('true', 'false').default('false'), 
    oauth: Joi.object({
        google: Joi.object({
            gg_id: Joi.string().optional(),
            gg_email: Joi.string().email().optional(),
        }).optional(),
    }).optional()
}).options({ abortEarly: false });

const validateUser = (userData) => {
    const validation = COLLECTION_SCHEMA.validate(userData);
    if (validation.error) {
        throw new Error(validation.error.details.map(detail => detail.message).join(', '));
    }
};

const addUser = async (userData) => {
    const { username, password, role, register_at } = userData
    const tempUserData = { username, password, role, register_at }
    const email = userData.email
    try {
        validateUser(userData);
        const db = getDB();
        await db.collection(COLLECTION_NAME).updateOne(
            { email },
            { $set: tempUserData }
        );
    } catch (error) {
        console.error("Error in addUser: ", error);
        throw error;
    }
};

const getUserById = async (userId) => {
    try {
        const db = getDB();
        return await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(userId) });
    } catch (error) {
        console.error("Error in getUserById: ", error);
    }
};

const getUserByUserName = async (username) => {
    try {
        const db = getDB();
        return await db.collection(COLLECTION_NAME).findOne({ username });
    } catch (error) {
        console.error("Error in getUserByUserName: ", error);
    }
};

const getUserByEmail = async (email) => {
    try {
        const db = getDB();
        return await db.collection(COLLECTION_NAME).findOne({ email });
    } catch (error) {
        console.error("Error in getUserByEmail: ", error);
    }
};

const confirmEmail = async (email) => {
    try {
        const db = getDB();
        await db.collection(COLLECTION_NAME).updateOne(
            { email },
            { $set: { emailConfirmed: 'true' } }
        );
    } catch (error) {
        console.error('Error in confirmEmail:', error);
        throw error;
    }
};

const updateRefreshToken = async (userId, refreshToken) => {
    try {
        const db = getDB();
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(userId) },
            { $set: { refreshToken }, $currentDate: { last_login: true } }
        );
    } catch (error) {
        console.error("Error in updateRefreshToken: ", error);
        throw error;
    }
};

const logoutUser = async (userId, updateData) => {
    try {
        const db = getDB();
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateData }
        );
    } catch (error) {
        console.error('Error in logoutUser:', error);
        throw error;
    }
};

const getUserBySub = async (sub) => {
    try {
        const db = getDB();
        return await db.collection(COLLECTION_NAME).findOne({ 'oauth.google.gg_id': sub });
    } catch (error) {
        console.error('Error in getUserBySub:', error);
        throw error;
    }
};

const updateUser = async (userId, userData) => {
    try {
        const db = getDB();
        const updateData = {};

        if (userData.username) {
            const usernameExists = await db.collection(COLLECTION_NAME).findOne({
                username: userData.username,
                _id: { $ne: new ObjectId(userId) }
            });
            if (usernameExists) {
                throw new Error("Username already exists");
            }
            updateData.username = userData.username;
        }

        if (userData.email) {
            const emailExists = await db.collection(COLLECTION_NAME).findOne({
                email: userData.email,
                _id: { $ne: new ObjectId(userId) }
            });
            if (emailExists) {
                throw new Error("Email already exists");
            }
            updateData.email = userData.email;
        }

        if (userData.password) {
            updateData.password = userData.password;
        }

        updateData.update_at = new Date();

        if (Object.keys(updateData).length === 0) {
            throw new Error("No valid fields to update");
        }

        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateData }
        );
        return updateData;
    } catch (error) {
        console.error("Error in updateUser: ", error);
        throw error;
    }
};

module.exports = {
    addUser,
    getUserById,
    getUserByUserName,
    getUserByEmail,
    updateRefreshToken,
    logoutUser,
    updateUser,
    getUserBySub,
    confirmEmail,
};
