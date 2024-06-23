const bcryptjs = require('bcryptjs');
const UserModel = require('../models/UserModel');
const UserModelDetail = require('../models/UserDetailModel');
const logger = require('../config/logger');

const getUserDetail = async (req, res) => {
    const { username } = req.body;
    try {
        const user = await UserModel.getUserByUserName(username);
        if (!user) {
            logger.warn(`User with username '${username}' not found`);
            return res.status(404).json({ error: 'User not found' });
        }

        const user_id = user._id.toString();
        const userDetail = await UserModelDetail.getUserDetailByUserId(user_id);
        const userData = {
            user_id: user_id,
            username: user.username,
            email: user.email,
            role: user.role,
            name: userDetail.name,
            about: userDetail.about,
            address: userDetail.address,
            avatar_uri: userDetail.avatar_uri,
        };
        res.status(200).json(userData);
    } catch (error) {
        logger.error('Error in getUserDetail:', error);
        res.status(500).json({ message: 'Error getUserDetail' });
    }
};

const updateUser = async (req, res) => {
    const user_id = req.user._id.toString();
    const {
        username, email, name, age, gender, about,
        phone_number, address, avatar_uri
    } = req.body;

    const user = {};
    if (username) user.username = username;
    if (email) user.email = email;

    const userDetail = {};
    if (name) userDetail.name = name;
    if (age) userDetail.age = age;
    if (gender) userDetail.gender = gender;
    if (about) userDetail.about = about;
    if (phone_number) userDetail.phone_number = phone_number;
    if (address) userDetail.address = address;
    if (avatar_uri) userDetail.avatar_uri = avatar_uri;

    try {
        const updatePromises = [];

        if (Object.keys(user).length > 0) {
            updatePromises.push(UserModel.updateUser(user_id, user));
        }

        if (Object.keys(userDetail).length > 0) {
            updatePromises.push(UserModelDetail.updateUser(user_id, userDetail));
        }

        await Promise.all(updatePromises);
        res.status(200).json({ message: 'Update User Successful' });
    } catch (error) {
        logger.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
};

const getListFriend = async (req, res) => {
    const user_id = req.user._id.toString();
    try {
        const friend_idList = await UserModelDetail.getListFriends(user_id);
        const friendDataList = [];
        for (let i = 0; i < friend_idList.length; i++) {
            const user_id = friend_idList[i];
            if (user_id !== null) {
                const friendDataResponse = await UserModel.getUserById(user_id);
                if (friendDataResponse == null) {
                    continue;
                }
                const friendData = {
                    user_id: friendDataResponse._id,
                    username: friendDataResponse.username
                };
                friendDataList.push(friendData);
            }
        }
        res.status(200).json({ friendDataList });
    } catch (error) {
        logger.error('Error fetching friend list:', error);
        res.status(500).json({ message: 'Error fetching friend list' });
    }
};

const updateRole = async (req, res) => {
    const user_id = req.user._id.toString();
    try {
        await UserModel.updateRole(user_id);
        res.status(200).json({ message: 'Update to seller successfully!' });
    } catch (error) {
        logger.error('Error in updateRole:', error);
        res.status(500).json({ message: 'Error updating role' });
    }
};

const updateUserName = async (req, res) => {
    const user_id = req.user._id.toString();
    const { username } = req.body;
    try {
        const updatedUser = await UserModel.updateUserName(user_id, username);
        res.status(200).json({ updatedUser });
    } catch (error) {
        logger.error('Error updating username:', error);
        res.status(500).json({ error: 'Error updating username' });
    }
};

const addFriend = async (req, res) => {
    const { friend_id } = req.body;
    const user_id = req.user._id.toString();
    try {
        await UserModelDetail.addFriend(user_id, friend_id);
        res.status(200).json({ message: 'Friend added successfully!' });
    } catch (error) {
        logger.error('Error adding friend:', error);
        res.status(500).json({ message: 'Error adding friend' });
    }
};

const checkFriendStatus = async (req, res) => {
    const { friend_id } = req.body;
    const user_id = req.user._id.toString();
    try {
        const is_Friend = await UserModelDetail.checkFriendStatus(user_id, friend_id);
        res.status(200).json({ is_Friend });
    } catch (error) {
        logger.error('Error checking friend status:', error);
        res.status(500).json({ message: 'Error checking friend status' });
    }
};

const delFriend = async (req, res) => {
    const { friend_id } = req.body;
    const user_id = req.user._id.toString();
    try {
        await UserModelDetail.delFriend(user_id, friend_id);
        res.status(200).json({ message: 'Friend deleted successfully!' });
    } catch (error) {
        logger.error('Error deleting friend:', error);
        res.status(500).json({ message: 'Error deleting friend' });
    }
};

const getAllFriend = async (req, res) => {
    try {
        const allFriend = await UserModel.getAllFriend();
        res.status(200).json(allFriend);
    } catch (error) {
        logger.error('Error getting all friends:', error);
        res.status(500).json({ message: 'Error getting all friends' });
    }
};

module.exports = {
    getUserDetail,
    updateUser,
    updateRole,
    getListFriend,
    addFriend,
    delFriend,
    checkFriendStatus,
    getAllFriend,
    updateUserName
};
