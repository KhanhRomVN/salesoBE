const notificationModel = require('../models/NotificationModel');
const logger = require('../config/logger');

const createNotification = async (req, res) => {
    const user_id = req.user._id.toString();
    const { message, type, status } = req.body;
    try {
        const notification = await notificationModel.createNotification({ user_id, message, type, status });
        res.status(201).json(notification);
    } catch (error) {
        logger.error('Error creating notification:', error);
        res.status(500).json({ error: 'Failed to create notification' });
    }
};

const getNotifications = async (req, res) => {
    const user_id = req.user._id.toString();
    try {
        const notifications = await notificationModel.getNotifications(user_id);
        res.status(200).json(notifications);
    } catch (error) {
        logger.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

const markAsRead = async (req, res) => {
    const user_id = req.user._id.toString();
    const { notification_id } = req.body;
    try {
        const updatedNotification = await notificationModel.markAsRead(user_id, notification_id);
        res.status(200).json(updatedNotification);
    } catch (error) {
        logger.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
};

const deleteNotification = async (req, res) => {
    const user_id = req.user._id.toString();
    const { notification_id } = req.params;
    try {
        await notificationModel.deleteNotification(user_id, notification_id);
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        logger.error('Error deleting notification:', error);
        res.status(500).json({ error: 'Failed to delete notification' });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    markAsRead,
    deleteNotification
};
