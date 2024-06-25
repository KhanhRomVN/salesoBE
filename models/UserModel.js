const Joi = require('joi');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10;
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

//* Register Basic 
const addUser = async (userData) => {
    const { username, password, role, register_at } = userData;
    const tempUserData = { username, password, role, register_at };
    const email = userData.email;
    try {
        validateUser(userData);
        const db = getDB();
        const user = await db.collection(COLLECTION_NAME).updateOne(
            { email },
            { $set: tempUserData }
        );
        console.log(user);
    } catch (error) {
        console.error("Error in addUser: ", error);
        throw error;
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

//* Register Google Account 
const addGoogleUser = async (newUser) => {
    try {
        const db = getDB();
        const result = await db.collection(COLLECTION_NAME).insertOne(newUser);
        return result.insertedId;
    } catch (error) {
        console.error("Error in addGoogleUser: ", error);
        throw error;
    }
}

//* Login 
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

//* Logout
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

//* Get Data User
const getUserById = async (userId) => {
    try {
        const db = getDB();
        return await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(userId) });
    } catch (error) {
        console.error("Error in getUserById: ", error);
    }
};

const getUserByUsername = async (username) => {
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

//* Get data user (google)
const getUserBySub = async (sub) => {
    try {
        const db = getDB();
        return await db.collection(COLLECTION_NAME).findOne({ 'oauth.google.gg_id': sub });
    } catch (error) {
        console.error('Error in getUserBySub:', error);
        throw error;
    }
};

//* Update data user
const updateUsername = async (user_id, username) => {
    try {
        const db = getDB();
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(user_id) },
            { $set: { username }}
        );
    } catch (error) {
        console.error("Error in addGoogleUser: ", error);
        throw error;
    }
}

const updateEmail = async (user_id, email) => {
    try {
        const db = getDB();
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(user_id) },
            { $set: { email }}
        );
    } catch (error) {
        console.error("Error updating email: ", error);
        throw error;
    }
};

const updateRole = async (user_id, role) => {
    try {
        const db = getDB();
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(user_id) },
            { $set: { role }}
        );
    } catch (error) {
        console.error("Error updating role: ", error);
        throw error;
    }
};

const updatePassword = async (user_id, currentPassword, newPassword) => {
    try {
        const db = getDB();
        const user = await getUserById(user_id);
        if (!user) {
            throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(user_id) },
            { $set: { password: hashedPassword } }
        );
    } catch (error) {
        console.error('Error in changePassword:', error);
        throw error;
    }
};

const updateForgetPassword = async (user_id, newPassword) => {
    try {
        const db = getDB();
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(user_id) },
            { $set: { password: hashedPassword } }
        );
    } catch (error) {
        console.error('Error in updatePassword:', error);
        throw error;
    }
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
    getUserBySub,
    updateUsername,
    updateEmail,
    updateRole,
    updatePassword,
    updateForgetPassword
};
