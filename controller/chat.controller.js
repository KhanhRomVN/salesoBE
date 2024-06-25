const ChatModel = require('../models/ChatModel');
const MessageModel = require('../models/MessageModel');

const getHistoryMessage = async (req, res) => {
    const { receiver_id } = req.body;
    const sender_id = req.user._id.toString();
    try {
        const chat = await ChatModel.getChatBox(sender_id, receiver_id);
        const chat_id = chat._id.toString();
        const messageList = await MessageModel.getAllMessage(chat_id);
        return res.status(200).json({ chat_id, messageList });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal getChatBox error' });
    }
};

const getLastMessage = async (req, res) => {
    const { receiver_id } = req.body;
    const sender_id = req.user._id.toString();
    try {
        const chat = await ChatModel.getChatBox(sender_id, receiver_id);
        const last_message = chat.last_message;
        return res.status(200).json({ last_message });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal getChatBox error' });
    }
};

const createGroupChat = async (req, res) => {
    const { groupName, userIds } = req.body;
    try {
        const groupChat = await ChatModel.createGroupChat(groupName, userIds);
        return res.status(201).json(groupChat);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal createGroupChat error' });
    }
};

const deleteGroupChat = async (req, res) => {
    const { groupId } = req.body;
    try {
        await ChatModel.deleteGroupChat(groupId);
        return res.status(200).json({ message: 'Group chat deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal deleteGroupChat error' });
    }
};

const addUserGroup = async (req, res) => {
    const { groupId, userId } = req.body;
    try {
        await ChatModel.addUserToGroup(groupId, userId);
        return res.status(200).json({ message: 'User added to group successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal addUserGroup error' });
    }
};

const deleteUserGroup = async (req, res) => {
    const { groupId, userId } = req.body;
    try {
        await ChatModel.removeUserFromGroup(groupId, userId);
        return res.status(200).json({ message: 'User removed from group successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal deleteUserGroup error' });
    }
};

module.exports = {
    getHistoryMessage,
    getLastMessage,
    createGroupChat,
    deleteGroupChat,
    addUserGroup,
    deleteUserGroup,
};
