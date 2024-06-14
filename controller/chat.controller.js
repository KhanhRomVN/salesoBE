const ChatModel = require('../models/ChatModel');

const getChatBox = async (req, res) => {
    const {receiver_id} = req.body; 
    const sender_id = req.user._id.toString();
    try {
        const chat = await ChatModel.getChatBox(sender_id, receiver_id);
        return res.status(200).json({ chat }); 
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ message: 'Internal getChatBox error' });
    }
};

module.exports = {
    getChatBox,
};
