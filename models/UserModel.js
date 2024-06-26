const { getDB } = require('../config/mongoDB');
const Joi = require('joi');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

//* Auth
const registerUser = async (email, userData) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne(
            { email: email },
            { $set: userData },
            { upsert: true } // Ensure user is added if not exists
        );
    } catch (error) {
        throw new Error('Failed to add user: ' + error.message);
    }
};

const confirmEmail = async (email) => {
    const db = getDB();
    return db.collection(COLLECTION_NAME).updateOne({ email }, { $set: { emailConfirmed: 'true' } });
};

const addGoogleUser = async (newUser) => {
    const db = getDB();
    return db.collection(COLLECTION_NAME).insertOne(newUser);
};

const updateRefreshToken = async (userId, refreshToken) => {
    const db = getDB();
    return db.collection(COLLECTION_NAME).updateOne({ _id: new ObjectId(userId) }, { $set: { refreshToken }, $currentDate: { last_login: true } });
};

const logoutUser = async (userId, updateData) => {
    const db = getDB();
    return db.collection(COLLECTION_NAME).updateOne({ _id: new ObjectId(userId) }, { $set: updateData });
};

//* Get User Data
const getUserById = async (userId) => {
    const db = getDB();
    return db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(userId) });
};

const getUserByUsername = async (username) => {
    const db = getDB();
    return db.collection(COLLECTION_NAME).findOne({ username });
};

const getUserByEmail = async (email) => {
    const db = getDB();
    return db.collection(COLLECTION_NAME).findOne({ email });
};

const getUserByGoogleId = async (googleId) => {
    const db = getDB();
    return db.collection(COLLECTION_NAME).findOne({ 'oauth.google.gg_id': googleId });
};

//* Update Data User [username, email, role]
const updateUserField = async (user_id, updateData) => {
    const db = getDB();
    try {
        db.collection(COLLECTION_NAME).updateOne({ _id: new ObjectId(user_id) }, { $set: updateData, $currentDate: { update_at: true } })
    } catch (error) {
        
    }
}

//* Update Password
const updatePassword = async (user_id, currentPassword, newPassword) => {
    const db = getDB();
    const user = await db.collection(COLLECTION_NAME).findOne({ _id: user_id });
    if (!await bcrypt.compare(currentPassword, user.password)) {
        throw new Error('Incorrect current password');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    await db.collection(COLLECTION_NAME).updateOne({ _id: user_id }, { $set: {password: hashedNewPassword} });
};

const updateForgetPassword = async (user_id, newPassword) => {
    const db = getDB();
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    await db.collection(COLLECTION_NAME).updateOne({ _id: user_id }, { $set: {password: hashedNewPassword} });
};

//* Google Linked
// Todo: Chưa code xong
const linkGoogleAccount = async (userId, googleAccount) => {
    const db = getDB();
    return db.collection(COLLECTION_NAME).updateOne({ _id: new ObjectId(userId) }, { $set: { 'oauth.google': googleAccount } });
};

module.exports = {
    registerUser,
    confirmEmail,
    addGoogleUser,
    updateRefreshToken,
    logoutUser,
    getUserById,
    getUserByUsername,
    updateUserField,
    getUserByEmail,
    updatePassword,
    updateForgetPassword,
    getUserByGoogleId,
    linkGoogleAccount,
};
