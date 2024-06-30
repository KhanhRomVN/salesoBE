const logger = require('../config/logger');
const GroupModel = require('../models/GroupModel')

const createGroup = async (req, res) => {
    const { name, about, avatar_uri, background_uri } = req.body
    const user_id = req.user._id;
    try {
        await GroupModel.createGroup()
    } catch (error) {
        
    }
}

module.exports = {
    createGroup
};
