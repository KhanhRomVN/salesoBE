const { getDB } = require('../config/mongoDB');
const Joi = require('joi');
const ChatModel = require('./ChatModel');

const COLLECTION_NAME = 'messages';
const COLLECTION_SCHEMA = Joi.object({
    chat_id: Joi.string().required(),
    sender_id: Joi.string().required(),
    message: Joi.string().required(),
    createdAt: Joi.date().default(() => new Date())
}).options({ abortEarly: false });

const validateMessageData = (messageData) => {
    const validation = COLLECTION_SCHEMA.validate(messageData);
    if (validation.error) {
        throw new Error(validation.error.details.map(detail => detail.message).join(', '));
    }
};

const addMessage = async (messageData) => {
    const db = getDB();
    try {
        validateMessageData(messageData);
        const { chat_id, message } = messageData;
        await ChatModel.addLastMessage(chat_id, { message_id: new ObjectId().toString(), timestamp: new Date() });
        const result = await db.collection(COLLECTION_NAME).insertOne(messageData);
        return result;
    } catch (error) {
        console.error("Error in addMessage: ", error);
        throw error;
    }
};

const getAllMessage = async (chat_id) => {
    const db = getDB();
    try {
        const result = await db.collection(COLLECTION_NAME).find({ chat_id }).toArray();
        return result;
    } catch (error) {
        console.error("Error in getAllMessage: ", error);
        throw error;
    }
};

module.exports = {
    addMessage,
    getAllMessage,
};
