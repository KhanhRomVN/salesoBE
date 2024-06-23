const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/mongoDB');

const COLLECTION_NAME = 'user_detail';
const COLLECTION_SCHEMA = Joi.object({
    user_id: Joi.string().required(),
    name: Joi.string().required(),
    age: Joi.number().integer().min(12).default(''),
    gender: Joi.string().valid('male', 'female').default(''),
    about: Joi.string().default(''),
    phone_number: Joi.string().pattern(/^[0-9]{10,11}$/).default(''),
    address: Joi.string().default(''),
    avatar_uri: Joi.string().default(''),
    friendList: Joi.array().default([])
}).options({ abortEarly: false });

const validateUserDetail = (userDetailData) => {
    const validation = COLLECTION_SCHEMA.validate(userDetailData);
    if (validation.error) {
        throw new Error(validation.error.details.map(detail => detail.message).join(', '));
    }
};

const addUserDetail = async (userDetailData) => {
    try {
        validateUserDetail(userDetailData);
        const db = getDB();
        const result = await db.collection(COLLECTION_NAME).insertOne(userDetailData);
        return result.insertedId.toString();
    } catch (error) {
        console.error("Error in addUserDetail: ", error);
        throw error;
    }
};

const updateUser = async (user_id, userDetailData) => {
    try {
        const db = getDB();

        const updateDetailData = {};

        if (userDetailData.phone_number) {
            // Check if the phone_number already exists for another user
            const phoneExists = await db.collection(COLLECTION_NAME).findOne({
                phone_number: userDetailData.phone_number,
                user_id: { $ne: user_id } // exclude the current user
            });
            if (phoneExists) {
                throw new Error("Phone number already exists");
            }
            updateDetailData.phone_number = userDetailData.phone_number;
        }

        if (userDetailData.name) updateDetailData.name = userDetailData.name;
        if (userDetailData.age) updateDetailData.age = userDetailData.age;
        if (userDetailData.gender) updateDetailData.gender = userDetailData.gender;
        if (userDetailData.about) updateDetailData.about = userDetailData.about;
        if (userDetailData.address) updateDetailData.address = userDetailData.address;
        if (userDetailData.avatar_uri) updateDetailData.avatar_uri = userDetailData.avatar_uri;
        if (userDetailData.background_uri) updateDetailData.background_uri = userDetailData.background_uri;

        if (Object.keys(updateDetailData).length === 0) {
            throw new Error("No valid fields to update");
        }

        await db.collection(COLLECTION_NAME).updateOne(
            { user_id },
            { $set: updateDetailData }
        );
    } catch (error) {
        console.error("Error in updateUser: ", error);
        throw error;
    }
};

const getUserDetailByUserId = async (user_id) => {
    try {
        const db = getDB();
        return await db.collection(COLLECTION_NAME).findOne({ user_id });
    } catch (error) {
        console.error("Error in getUserDetailByUserId: ", error);
        throw error;
    }
};

module.exports = {
    addUserDetail,
    updateUser,
    getUserDetailByUserId
};