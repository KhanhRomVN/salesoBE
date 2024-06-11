const UserModel = require('../models/UserModel');
const ChatModel = require('../models/ChatModel');

const getChats = async (req, res) => {
    try {
        const userA = req.user._id.toString();
        const { receiver_id } = req.body;
        const userB = receiver_id;

        const chat_id = await ChatModel.getChatID(userA, userB);
        if (!chat_id) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        const chats = await ChatModel.getChatsByChatID(chat_id);

        return res.status(200).json({chats, chat_id});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const sendChat = async (req, res) => {
    try {
        const sender_id = req.user._id.toString();
        const { receiver_id, text, images } = req.body;

        const chat_id = await ChatModel.getChatID(sender_id, receiver_id);
        if (!chat_id) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        const send = await ChatModel.sendChat(sender_id, chat_id, text, images);
        return res.status(200).json(send);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getChats,
    sendChat,
};
