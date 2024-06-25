const { getDB } = require('../config/mongoDB');
const Joi = require('joi');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'chats';
const COLLECTION_SCHEMA = Joi.object({
    participants: Joi.array().items(Joi.string()).length(2).required(),
    last_message: Joi.object({
        message_id: Joi.string().required(),
        timestamp: Joi.date().required(),
    }).allow(null),
    created_at: Joi.date().required(),
    updated_at: Joi.date().required()
}).options({ abortEarly: false });

const getChatBox = async (userA, userB) => {
    const db = getDB();
    try {
        let chat = await db.collection(COLLECTION_NAME).findOne({
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
            chat = result.ops[0];
        }
        return chat;
    } catch (error) {
        console.error('Error in getChatBox:', error);
        throw error;
    }
};

const addLastMessage = async (chat_id, last_message) => {
    const db = getDB();
    try {
        const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
            { _id: new ObjectId(chat_id) },
            { $set: { last_message: last_message, updated_at: new Date() } },
            { returnOriginal: false }
        );
        return result.value;
    } catch (error) {
        console.error('Error updating last message:', error);
        throw error;
    }
};

module.exports = {
    getChatBox,
    addLastMessage
};
