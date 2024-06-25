const { getDB } = require('../config/mongoDB');
const Joi = require('joi');

const COLLECTION_NAME = 'notifications';

const notificationSchema = Joi.object({
    user_id: Joi.string().required(),
    address_id: Joi.string().required(),
    message: Joi.string().required(),
    type: Joi.string().required(),
    status: Joi.string().valid('read', 'unread').default('unread'),
    created_at: Joi.date().default(Date.now)
}).options({ abortEarly: false });

const createNotification = async (notificationData) => {
    try {
        const { error, value } = notificationSchema.validate(notificationData);
        if (error) {
            throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
        }
        const db = await getDB();
        const result = await db.collection(COLLECTION_NAME).insertOne(value);
        return result
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

const getNotifications = async (user_id) => {
    try {
        const db = await getDB();
        return await db.collection(COLLECTION_NAME).find({ user_id }).toArray();
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
};

const markAsRead = async (user_id, notification_id) => {
    try {
        const db = await getDB();
        const result = await db.collection(COLLECTION_NAME).findOneAndUpdate(
            { _id: new require('mongodb').ObjectID(notification_id), user_id },
            { $set: { status: 'read' } },
            { returnOriginal: false }
        );
        return result.value;
    } catch (error) {
        console.error('Error marking notification as read:', error);
        throw error;
    }
};

const deleteNotification = async (user_id, notification_id) => {
    try {
        const db = await getDB();
        await db.collection(COLLECTION_NAME).deleteOne({ _id: new require('mongodb').ObjectID(notification_id), user_id });
    } catch (error) {
        console.error('Error deleting notification:', error);
        throw error;
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead,
    deleteNotification
};
