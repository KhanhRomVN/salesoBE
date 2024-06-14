const { getDB } = require('../config/mongoDB');
const Joi = require('joi');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'chats';
const COLLECTION_SCHEMA = Joi.object({
    participants: Joi.array().items(Joi.string()).length(2),
    last_message: Joi.object({
        message_id: Joi.string().required(),
        timestamp: Joi.date().required(),
    }),
    created_at: Joi.date().required(),
    updated_at: Joi.date().required()
}).options({ abortEarly: false });

const getChatBox = async (userA, userB) => {
    const db = getDB();
    try {
        const chat = await db.collection(COLLECTION_NAME).findOne({
            participants: { $all: [userA, userB] }
        });

        if (!chat) {
            const newChat = {
                participants: [userA, userB],
                last_message: null,
                created_at: new Date(),
                updated_at: new Date(),
            };

            const result = await db.collection(COLLECTION_NAME).insertOne(newChat);
            return result
        }
        return chat;
    } catch (error) {
        console.error('Error in getChatBox:', error);
        throw error;
    }
};

module.exports = {
    getChatBox
};
