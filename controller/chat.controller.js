const ChatModel = require('../models/ChatModel');
const MessageModel = require('../models/MessageModel')

const getChatBox = async (req, res) => {
    const {receiver_id} = req.body; 
    const sender_id = req.user._id.toString();
    try {
        const chat = await ChatModel.getChatBox(sender_id, receiver_id);
        const chat_id = chat._id.toString()

        const MessageList = await MessageModel.getAllMessage(chat_id)
        return res.status(200).json({chat_id, MessageList}); 
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ message: 'Internal getChatBox error' });
    }
};

module.exports = {
    getChatBox,
};
