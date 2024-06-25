const UserModel = require('../models/UserModel');
const UserModelDetail = require('../models/UserDetailModel');
const logger = require('../config/logger');
const OTPModel = require('../models/OTPModel');
const crypto = require('crypto');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailerConfig');

const generateOTP = () => crypto.randomBytes(3).toString('hex');

//* Get data user
const getUserData = async (req, res) => {
    const { username } = req.body;
    try {
        const user = await UserModel.getUserByUsername(username);
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
            age: userDetail.age,
            gender: userDetail.gender,
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

//* Update user data
const updateUsername = async (req, res) => {
    const user_id = req.user._id.toString();
    const { username } = req.body;
    try {
        const isExitingUsername = await UserModel.getUserByUsername(username)
        if (isExitingUsername) {
            return res.status(400).json({ error: 'Username already taken' });
        }
        await UserModel.updateUsername(user_id, username);
        res.status(200).json({ message: 'Update username successfully!' });
    } catch (error) {
        logger.error('Error updating username:', error);
        res.status(500).json({ error: 'Error updating username' });
    }
};

const updateEmail = async (req, res) => {
    const user_id = req.user._id.toString();
    const { email } = req.body;
    try {
        const isExitingEmail = await UserModel.getUserByEmail(email)
        if (isExitingEmail) {
            return res.status(400).json({ error: 'Email already taken' });
        }
        await UserModel.updateEmail(user_id, email);
        res.status(200).json({ message: 'Update email successfully!' });
    } catch (error) {
        logger.error('Error updating email:', error);
        res.status(500).json({ error: 'Error updating email' });
    }
};

const updateRole = async (req, res) => {
    const user_id = req.user._id.toString();
    const { role } = req.body;
    try {
        await UserModel.updateRole(user_id, role);
        res.status(200).json({ message: 'Update role successfully!' });
    } catch (error) {
        logger.error('Error updating role:', error);
        res.status(500).json({ error: 'Error updating role' });
    }
};

//* Change Password For Basic Account
const updatePassword = async (req, res) => {
    const user_id = req.user._id.toString();
    const { currentPassword, newPassword } = req.body;
    try {
        await UserModel.updatePassword(user_id, currentPassword, newPassword);
        res.status(200).json({ message: 'Password changed successfully!' });
    } catch (error) {
        logger.error('Error changing password:', error);
        res.status(500).json({ error: 'Error changing password' });
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

//* Update user detail data
const updateName = async (req, res) => {
    const user_id = req.user._id.toString();
    const { name } = req.body;
    try {
        await UserModelDetail.updateName(user_id, name);
        res.status(200).json({ message: 'Update name successfully!' });
    } catch (error) {
        logger.error('Error updating name:', error);
        res.status(500).json({ error: 'Error updating name' });
    }
};

const updateAge = async (req, res) => {
    const user_id = req.user._id.toString();
    const { age } = req.body;
    try {
        await UserModelDetail.updateAge(user_id, age);
        res.status(200).json({ message: 'Update age successfully!' });
    } catch (error) {
        logger.error('Error updating age:', error);
        res.status(500).json({ error: 'Error updating age' });
    }
};

const updateGender = async (req, res) => {
    const user_id = req.user._id.toString();
    const { gender } = req.body;
    try {
        await UserModelDetail.updateGender(user_id, gender);
        res.status(200).json({ message: 'Update gender successfully!' });
    } catch (error) {
        logger.error('Error updating gender:', error);
        res.status(500).json({ error: 'Error updating gender' });
    }
};

const updateAbout = async (req, res) => {
    const user_id = req.user._id.toString();
    const { about } = req.body;
    try {
        await UserModelDetail.updateAbout(user_id, about);
        res.status(200).json({ message: 'Update about successfully!' });
    } catch (error) {
        logger.error('Error updating about:', error);
        res.status(500).json({ error: 'Error updating about' });
    }
};

const updateAddress = async (req, res) => {
    const user_id = req.user._id.toString();
    const { address } = req.body;
    try {
        await UserModelDetail.updateAddress(user_id, address);
        res.status(200).json({ message: 'Update address successfully!' });
    } catch (error) {
        logger.error('Error updating address:', error);
        res.status(500).json({ error: 'Error updating address' });
    }
};

const updateAvatar = async (req, res) => {
    const user_id = req.user._id.toString();
    const { avatar_uri } = req.body;
    try {
        await UserModelDetail.updateAvatar(user_id, avatar_uri);
        res.status(200).json({ message: 'Update avatar successfully!' });
    } catch (error) {
        logger.error('Error updating avatar:', error);
        res.status(500).json({ error: 'Error updating avatar' });
    }
};

//* Check google account & Linked Account
// const checkGoogle = async (req, res) => {

// };

// const linkedGoogle = async (req, res) => {

// };

//* Add friend, get list friend, del friend and check friend status
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
    updateAbout,
    updateAddress,
    updateAvatar,
    // checkGoogle,
    // linkedGoogle,
    addFriend,
    checkFriendStatus,
    delFriend,
    getListFriend,
};
