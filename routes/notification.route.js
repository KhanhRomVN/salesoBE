const express = require('express');
const { authToken } = require('../middleware/authToken');
const notificationController = require('../controller/notification.controller');

const router = express.Router();

//* Create Notification
router.post('/notify-create', authToken, notificationController.createNotification);

//* Get All Notification From User
router.post('/user_notify', authToken, notificationController.getNotifications);

//* Mask As Read Notification
router.put('/mark-as-read', authToken, notificationController.markAsRead);

//* Delete A Notification
router.delete('/delete', authToken, notificationController.deleteNotification);

module.exports = router;