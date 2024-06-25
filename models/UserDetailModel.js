const { getDB } = require('../config/mongoDB');
const Joi = require('joi');
const { ObjectId } = require('mongodb');

// Schema validation
const COLLECTION_NAME = 'user_details';
const COLLECTION_SCHEMA = Joi.object({
    user_id: Joi.string().required(),
    name: Joi.string().optional(),
    age: Joi.number().integer().min(0).optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    address: Joi.string().optional(),
    about: Joi.string().optional(),
    avatar: Joi.string().uri().optional(),
}).options({ abortEarly: false });

const validateUserDetail = (userDetailData) => {
    const validation = COLLECTION_SCHEMA.validate(userDetailData);
    if (validation.error) {
        throw new Error(validation.error.details.map(detail => detail.message).join(', '));
    }
};

// UserDetail CRUD operations
const addUserDetail = async (userDetailData) => {
    validateUserDetail(userDetailData);
    const db = getDB();
    return db.collection(COLLECTION_NAME).insertOne(userDetailData);
};

const getUserDetailByUserId = async (userId) => {
    const db = getDB();
    return db.collection(COLLECTION_NAME).findOne({ user_id: new ObjectId(userId) });
};

const updateUserDetail = async (userId, updateData) => {
    validateUserDetail(updateData);
    const db = getDB();
    return db.collection(COLLECTION_NAME).updateOne({ user_id: new ObjectId(userId) }, { $set: updateData });
};

const updateName = (userId, { name }) => updateUserDetail(userId, { name });
const updateAge = (userId, { age }) => updateUserDetail(userId, { age });
const updateGender = (userId, { gender }) => updateUserDetail(userId, { gender });
const updateAddress = (userId, { address }) => updateUserDetail(userId, { address });
const updateAbout = (userId, { about }) => updateUserDetail(userId, { about });
const updateAvatar = (userId, { avatar }) => updateUserDetail(userId, { avatar });

module.exports = {
    addUserDetail,
    getUserDetailByUserId,
    updateName,
    updateAge,
    updateGender,
    updateAddress,
    updateAbout,
    updateAvatar,
};
