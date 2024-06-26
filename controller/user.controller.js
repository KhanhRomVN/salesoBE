const UserModel = require('../models/UserModel');
const UserDetailModel = require('../models/UserDetailModel');
const OTPModel = require('../models/OTPModel');
const logger = require('../config/logger');
const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailerConfig');
const { validationResult } = require('express-validator');

// Utility function to generate OTP
const generateOTP = () => crypto.randomBytes(3).toString('hex');

// User Controller Methods
const getUserData = async (req, res) => {
    const { username } = req.body;
    try {
        const user = await UserModel.getUserByUsername(username);
        if (!user) {
            logger.warn(`User with username '${username}' not found`);
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = {
            user_id: user._id.toString(),
            username: user.username,
        }

        const userDetail = await UserDetailModel.getUserDetailByUserId(user._id);
        if (!userDetail) {
            res.status(200).json({ userData });
        } else {
            res.status(200).json({ userData, ...userDetail });
        }
    } catch (error) {
        logger.error('Error in getUserData:', error);
        res.status(500).json({ error: 'Error fetching user data' });
    }
};

const updateUserField = async (req, res, updateFunc, successMessage) => {
    const user_id = req.user._id;
    const updateData = req.body;
    try {
        await updateFunc(user_id, updateData);
        res.status(200).json({ message: successMessage });
    } catch (error) {
        logger.error(`Error updating ${successMessage.toLowerCase()}:`, error);
        res.status(500).json({ error: `Error updating ${successMessage.toLowerCase()}` });
    }
};

// Define specific update functions for user fields
const updateUsername = (req, res) => updateUserField(req, res, UserModel.updateUsername, 'Username');
const updateEmail = (req, res) => updateUserField(req, res, UserModel.updateEmail, 'Email');
const updateRole = (req, res) => updateUserField(req, res, UserModel.updateRole, 'Role');
const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user_id = req.user._id;
    try {
        await UserModel.updatePassword(user_id, currentPassword, newPassword);
        res.status(200).json({ message: 'Password updated successfully!' });
    } catch (error) {
        logger.error('Error updating password:', error);
        res.status(500).json({ error: 'Error updating password' });
    }
};

const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.getUserByEmail(email);
        if (!user) {
            logger.warn(`User with email '${email}' not found`);
            return res.status(404).json({ error: 'User not found' });
        }

        const otp = generateOTP();
        await OTPModel.storeOTP(email, otp);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP',
            html: `<p>Your OTP code is: ${otp}</p>`
        });

        logger.info(`OTP sent to email: ${email}`);
        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        logger.error('Forget Password Error:', error);
        res.status(500).json({ error: 'Forget Password Error' });
    }
};

const updateForgetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const validOTP = await OTPModel.verifyOTP(email, otp);
        if (!validOTP) {
            logger.warn(`Invalid OTP for email: ${email}`);
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        const user = await UserModel.getUserByEmail(email);
        if (!user) {
            logger.warn(`User with email '${email}' not found`);
            return res.status(404).json({ error: 'User not found' });
        }

        await UserModel.updateForgetPassword(user._id, newPassword);
        res.status(200).json({ message: 'Password reset successfully!' });
    } catch (error) {
        logger.error('Error resetting password:', error);
        res.status(500).json({ error: 'Error resetting password' });
    }
};

// User Detail Methods
const updateName = (req, res) => updateUserField(req, res, UserDetailModel.updateName, 'Name');
const updateAge = (req, res) => updateUserField(req, res, UserDetailModel.updateAge, 'Age');
const updateGender = (req, res) => updateUserField(req, res, UserDetailModel.updateGender, 'Gender');
const updateAddress = (req, res) => updateUserField(req, res, UserDetailModel.updateAddress, 'Address');
const updateAbout = (req, res) => updateUserField(req, res, UserDetailModel.updateAbout, 'About');
const updateAvatar = (req, res) => updateUserField(req, res, UserDetailModel.updateAvatar, 'Avatar');

// Google Account Methods
const checkGoogle = async (req, res) => {
    const user_id = req.user._id;
    try {
        const user = await UserModel.getUserById(user_id);
        if (user.oauth && user.oauth.google && user.oauth.google.gg_id) {
            res.status(200).json({ googleLinked: true });
        } else {
            res.status(200).json({ googleLinked: false });
        }
    } catch (error) {
        logger.error('Error checking Google account:', error);
        res.status(500).json({ error: 'Error checking Google account' });
    }
};

const linkGoogle = async (req, res) => {
    const user_id = req.user._id;
    const { googleAccount } = req.body;
    try {
        await UserModel.linkGoogleAccount(user_id, googleAccount);
        res.status(200).json({ message: 'Google account linked successfully!' });
    } catch (error) {
        logger.error('Error linking Google account:', error);
        res.status(500).json({ error: 'Error linking Google account' });
    }
};

// Friend Methods
const sendFriendRequest = async (req, res) => {
    const user_id = req.user._id;
    const { friendId } = req.body;
    try {
        await UserDetailModel.sendFriendRequest(user_id, friendId);
        res.status(200).json({ message: 'Friend request sent successfully!' });
    } catch (error) {
        logger.error('Error sending friend request:', error);
        res.status(500).json({ error: 'Error sending friend request' });
    }
};

const acceptRequest = async (req, res) => {
    const user_id = req.user._id;
    const { friendId } = req.body;
    try {
        await UserDetailModel.acceptFriendRequest(user_id, friendId);
        res.status(200).json({ message: 'Friend request accepted successfully!' });
    } catch (error) {
        logger.error('Error accepting friend request:', error);
        res.status(500).json({ error: 'Error accepting friend request' });
    }
};

const refuseRequest = async (req, res) => {
    const user_id = req.user._id;
    const { friendId } = req.body;
    try {
        await UserDetailModel.refuseFriendRequest(user_id, friendId);
        res.status(200).json({ message: 'Friend request refused successfully!' });
    } catch (error) {
        logger.error('Error refusing friend request:', error);
        res.status(500).json({ error: 'Error refusing friend request' });
    }
};

const checkFriendStatus = async (req, res) => {
    const user_id = req.user._id;
    const { friendId } = req.query;
    try {
        const status = await UserDetailModel.checkFriendStatus(user_id, friendId);
        res.status(200).json({ friendStatus: status });
    } catch (error) {
        logger.error('Error checking friend status:', error);
        res.status(500).json({ error: 'Error checking friend status' });
    }
};

const getListFriend = async (req, res) => {
    const user_id = req.user._id;
    try {
        const friends = await UserDetailModel.getListFriends(user_id);
        res.status(200).json({ friends });
    } catch (error) {
        logger.error('Error getting list of friends:', error);
        res.status(500).json({ error: 'Error getting list of friends' });
    }
};

const unfriend = async (req, res) => {
    const user_id = req.user._id;
    const { friendId } = req.body;
    try {
        await UserDetailModel.unfriend(user_id, friendId);
        res.status(200).json({ message: 'Unfriended successfully!' });
    } catch (error) {
        logger.error('Error unfriending:', error);
        res.status(500).json({ error: 'Error unfriending' });
    }
};

const blockFriend = async (req, res) => {
    const user_id = req.user._id;
    const { friendId } = req.body;
    try {
        await UserDetailModel.blockFriend(user_id, friendId);
        res.status(200).json({ message: 'Blocked successfully!' });
    } catch (error) {
        logger.error('Error blocking friend:', error);
        res.status(500).json({ error: 'Error blocking friend' });
    }
};

const unblockFriend = async (req, res) => {
    const user_id = req.user._id;
    const { friendId } = req.body;
    try {
        await UserDetailModel.unblockFriend(user_id, friendId);
        res.status(200).json({ message: 'Unblocked successfully!' });
    } catch (error) {
        logger.error('Error unblocking friend:', error);
        res.status(500).json({ error: 'Error unblocking friend' });
    }
};

module.exports = {
    getUserData,
    updateUsername,
    updateEmail,
    updateRole,
    updatePassword,
    forgetPassword,
    updateForgetPassword,
    updateName,
    updateAge,
    updateGender,
    updateAddress,
    updateAbout,
    updateAvatar,
    checkGoogle,
    linkGoogle,
    sendFriendRequest,
    acceptRequest,
    refuseRequest,
    checkFriendStatus,
    getListFriend,
    unfriend,
    blockFriend,
    unblockFriend,
};
