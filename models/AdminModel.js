const { getDB } = require('../config/mongoDB');

const getAllUsers = async () => {
    try {
        const db = getDB();
        return await db.collection('users').find({}).toArray();
    } catch (error) {
        console.error("Error in getAllUsers: ", error);
        throw error;
    }
};

module.exports = {
    getAllUsers
};
