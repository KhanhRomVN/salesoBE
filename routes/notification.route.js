const express = require('express');
const { authToken } = require('../middleware/authToken');
const notificationController = require('../controller/notification.controller');
const router = express.Router();

//* Get Notification
router.post('/user_notify', authToken, notificationController.getNotifications);

//* Add Notification
router.post('/notify-create', authToken, notificationController.createNotification);

//* Del Notification
router.post('/delete', authToken, notificationController.deleteNotification);

//* Read Notification
router.post('/mark-as-read', authToken, notificationController.markAsRead);

module.exports = router;