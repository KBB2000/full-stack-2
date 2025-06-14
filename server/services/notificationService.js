const Notification = require('../models/Notification');
const logger = require('../config/logger');
const socketService = require('./socketService');

// Create and send notification
exports.createNotification = async (userId, message, type, relatedEntity = null, relatedEntityModel = null) => {
  try {
    const notification = await Notification.create({
      user: userId,
      message,
      type,
      relatedEntity,
      relatedEntityModel
    });

    // Send real-time notification via WebSocket
    const io = socketService.getIo();
    io.to(`user_${userId}`).emit('newNotification', notification);

    return notification;
  } catch (err) {
    logger.error(`Error creating notification: ${err.message}`);
  }
};

// Get user notifications
exports.getUserNotifications = async (userId, readStatus = null) => {
  try {
    let query = { user: userId };

    if (readStatus !== null) {
      query.read = readStatus;
    }

    const notifications = await Notification.find(query)
      .sort('-createdAt')
      .limit(50);

    return notifications;
  } catch (err) {
    logger.error(`Error getting notifications: ${err.message}`);
    throw err;
  }
};

// Mark notification as read
exports.markAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true }
    );

    return notification;
  } catch (err) {
    logger.error(`Error marking notification as read: ${err.message}`);
    throw err;
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (userId) => {
  try {
    await Notification.updateMany(
      { user: userId, read: false },
      { read: true }
    );

    return true;
  } catch (err) {
    logger.error(`Error marking all notifications as read: ${err.message}`);
    throw err;
  }
};