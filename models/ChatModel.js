const { getDB } = require('../config/mongoDB');
const { ObjectId } = require('mongodb');
const Joi = require('joi');

const CHAT_COLLECTION_NAME = 'userChat';
const MESSAGE_COLLECTION_NAME = 'chatMessages';
const COLLECTION_SCHEMA_FOR_CHATID = Joi.object({
    userA: Joi.string().required(),
    userB: Joi.string().required(),
    createdAt: Joi.date().default(() => new Date()),
}).options({ abortEarly: false });

const COLLECTION_SCHEMA_FOR_CHATS = Joi.object({
    chatId: Joi.string().required(),
    senderId: Joi.string().required(),
    text: Joi.string().required(),
    images: Joi.array().items(Joi.string().uri()),
    createdAt: Joi.date().default(() => new Date()),
}).options({ abortEarly: false });

const getChatID = async (userA, userB) => {
    const db = getDB();
    const chat = await db.collection(CHAT_COLLECTION_NAME).findOne({
        $or: [
            { userA, userB },
            { userA: userB, userB: userA }
        ]
    });

    if (chat) {
        return chat._id.toString();
    } else {
        const newChat = {
            userA,
            userB,
            createdAt: new Date(),
        };

        // Validate the newChat object before inserting
        const { error } = COLLECTION_SCHEMA_FOR_CHATID.validate(newChat);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const result = await db.collection(CHAT_COLLECTION_NAME).insertOne(newChat);
        return result.insertedId.toString();
    }
};

const getChatsByChatID = async (chat_id) => {
    const db = getDB();
    console.log(chat_id);
    const messages = await db.collection(MESSAGE_COLLECTION_NAME).find({ chatId: chat_id }).toArray();
    return messages;
};

const sendChat = async (sender_id, chat_id, text, images) => {
    const db = getDB();
    const newMessage = {
        chatId: chat_id,
        senderId: sender_id,
        text,
        images,
        createdAt: new Date(),
    };

    // Validate the newMessage object before inserting
    const { error } = COLLECTION_SCHEMA_FOR_CHATS.validate(newMessage);
    if (error) {
        throw new Error(error.details[0].message);
    }

    const result = await db.collection(MESSAGE_COLLECTION_NAME).insertOne(newMessage);
    return result
};

module.exports = {
    getChatID,
    getChatsByChatID,
    sendChat,
};
