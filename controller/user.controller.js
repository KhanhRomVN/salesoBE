const UserModel = require('../models/UserModel');
const UserDetailModel = require('../models/UserDetailModel');
const OTPModel = require('../models/OTPModel');
const logger = require('../config/logger');
const crypto = require('crypto');
const transporter = require('../config/nodemailerConfig');
const generateOTP = () => crypto.randomBytes(3).toString('hex');

//* Get User + User Detail
const getUserData = async (req, res) => {
    const { username } = req.body;
    try {
        const user = await UserModel.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = {
            user_id: user._id.toString(),
            username: user.username,
        };

        const userDetail = await UserDetailModel.getUserDetailByUserId(user._id.toString());
        const userDataFinal = userDetail
            ? { ...userData, ...userDetail }
            : userData;

        res.status(200).json(userDataFinal);
    } catch (error) {
        logger.error('Error in getUserData:', error);
        res.status(500).json({ error: 'Error fetching user data' });
    }
};

//* Update User [username, email, role] & [name, age. gender, about, address, avatar]
const updateUserField = async (req, res) => {
    const { field, value } = req.body;
    const user_id = req.user._id;
    try {
        await UserModel.updateUserField(user_id, { [field]: value });
        res.status(200).json({ message: `${field} updated successfully!` });
    } catch (error) {
        logger.error(`Error updating ${field}:`, error);
        res.status(500).json({ error: `Error updating ${field}` });
    }
};

const updateUserDetailField = async (req, res) => {
    const { field, value } = req.body;
    const user_id = req.user._id.toString()
    try {
        await UserDetailModel.updateUserDetailField(user_id, { [field]: value });
        res.status(200).json({ message: `${field} updated successfully!` });
    } catch (error) {
        logger.error(`Error updating ${field}:`, error);
        res.status(500).json({ error: `Error updating ${field}` });
    }
};

//* Update Password
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
    const user_id = req.user._id;
    const { email } = req.body;
    try {
        const user = await UserModel.getUserById(user_id);
        if (!user) {
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
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        const user = await UserModel.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await UserModel.updateForgetPassword(user._id, newPassword);
        res.status(200).json({ message: 'Password reset successfully!' });
    } catch (error) {
        logger.error('Error resetting password:', error);
        res.status(500).json({ error: 'Error resetting password' });
    }
};

//* Google Account
const checkGoogle = async (req, res) => {
    const user_id = req.user._id;
    try {
        const user = await UserModel.getUserById(user_id);
        const googleLinked = user?.oauth?.google?.gg_id ? true : false;
        res.status(200).json({ googleLinked });
    } catch (error) {
        logger.error('Error checking Google account:', error);
        res.status(500).json({ error: 'Error checking Google account' });
    }
};

// Todo: chưa làm xong đâu
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

//* Friend User [ User Detail ]
const friendRequest = async (req, res) => {
    const user_id = req.user._id.toString()
    const { friend_id } = req.body;
    try {
        await UserDetailModel.sendFriendRequest(user_id, friend_id);
        res.status(200).json({ message: 'Friend request sent successfully!' });
    } catch (error) {
        logger.error('Error sending friend request:', error);
        res.status(500).json({ error: 'Error sending friend request' });
    }
};

const friendActions = async (req, res) => {
    const user_id = req.user._id.toString()
    const { action, friend_id } = req.body;
    try {
        switch (action) {
            case 'accept':
                await UserDetailModel.acceptFriendRequest(user_id, friend_id);
                res.status(200).json({ message: 'Friend request accepted successfully!' });
                break;
            case 'refuse':
                await UserDetailModel.rejectFriendRequest(user_id, friend_id);
                res.status(200).json({ message: 'Friend request refused successfully!' });
                break;
            default:
                res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        logger.error(`Error ${action}ing friend request:`, error);
        res.status(500).json({ error: `Error ${action}ing friend request` });
    }
};

const getListFriendRequest = async (req, res) => {
    const user_id = req.user._id.toString();
    try {
        const friendRequest = await UserDetailModel.getListFriendRequest(user_id)
        res.status(200).json(friendRequest);
    } catch (error) {
        logger.error(`Error getListFriendRequest:`, error);
        res.status(500).json({ error: `Error getListFriendRequest` });
    }
}

const checkFriendStatus = async (req, res) => {
    const user_id = req.user._id.toString();
    const { friend_id } = req.body;
    try {
        const status = await UserDetailModel.checkFriendStatus(user_id, friend_id);
        res.status(200).json(status);
    } catch (error) {
        logger.error('Error checking friend status:', error);
        res.status(500).json({ error: 'Error checking friend status' });
    }
};

const getListFriend = async (req, res) => {
    const user_id = req.user._id.toString();
    try {
        const friends = await UserDetailModel.getListFriend(user_id);
        res.status(200).json(friends);
    } catch (error) {
        logger.error('Error getting friend list:', error);
        res.status(500).json({ error: 'Error getting friend list' });
    }
};

const blockFriend = async (req, res) => {
    const user_id = req.user._id.toString();
    const { friend_id } = req.body;
    try {
        await UserDetailModel.blockFriend(user_id, friend_id);
        res.status(200).json({ message: 'Blocked successfully!' });
    } catch (error) {
        logger.error('Error blocking friend:', error);
        res.status(500).json({ error: 'Error blocking friend' });
    }
};

const unblockFriend = async (req, res) => {
    const user_id = req.user._id.toString();
    const { friend_id } = req.body;
    try {
        await UserDetailModel.unblockFriend(user_id, friend_id);
        res.status(200).json({ message: 'Unblocked successfully!' });
    } catch (error) {
        logger.error('Error unblocking friend:', error);
        res.status(500).json({ error: 'Error unblocking friend' });
    }
};

const getListBlockFriend = async (req, res) => {
    const user_id = req.user._id.toString();
    try {
        const blockedFriends = await UserDetailModel.getListBlockFriend(user_id);
        res.status(200).json(blockedFriends);
    } catch (error) {
        logger.error('Error getting blocked friend list:', error);
        res.status(500).json({ error: 'Error getting blocked friend list' });
    }
};

module.exports = {
    getUserData,
    updateUserField,
    updateUserDetailField,
    updatePassword,
    forgetPassword,
    updateForgetPassword,
    checkGoogle,
    linkGoogle,
    friendRequest,
    friendActions,
    getListFriendRequest,
    checkFriendStatus,
    getListFriend,
    getListBlockFriend,
    blockFriend,
    unblockFriend,
};
