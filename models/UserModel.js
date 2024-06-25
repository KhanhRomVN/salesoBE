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

// User CRUD operations
const addUser = async (userData) => {
    validateUser(userData);
    const db = getDB();
    return db.collection(COLLECTION_NAME).insertOne(userData);
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

const updateUser = async (userId, updateData) => {
    validateUser(updateData);
    const db = getDB();
    return db.collection(COLLECTION_NAME).updateOne({ _id: new ObjectId(userId) }, { $set: updateData, $currentDate: { update_at: true } });
};

const updateUsername = (userId, { username }) => updateUser(userId, { username });
const updateEmail = (userId, { email }) => updateUser(userId, { email });
const updateRole = (userId, { role }) => updateUser(userId, { role });
const updatePassword = async (userId, currentPassword, newPassword) => {
    const db = getDB();
    const user = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(userId) });

    if (!await bcrypt.compare(currentPassword, user.password)) {
        throw new Error('Incorrect current password');
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    return updateUser(userId, { password: hashedNewPassword });
};

const updateForgetPassword = async (userId, newPassword) => {
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    return updateUser(userId, { password: hashedNewPassword });
};

// Google Auth specific methods
const getUserByGoogleId = async (googleId) => {
    const db = getDB();
    return db.collection(COLLECTION_NAME).findOne({ 'oauth.google.gg_id': googleId });
};

const linkGoogleAccount = async (userId, googleAccount) => {
    const db = getDB();
    return db.collection(COLLECTION_NAME).updateOne({ _id: new ObjectId(userId) }, { $set: { 'oauth.google': googleAccount } });
};

module.exports = {
    addUser,
    confirmEmail,
    addGoogleUser,
    updateRefreshToken,
    logoutUser,
    getUserById,
    getUserByUsername,
    getUserByEmail,
    updateUsername,
    updateEmail,
    updateRole,
    updatePassword,
    updateForgetPassword,
    getUserByGoogleId,
    linkGoogleAccount,
};
