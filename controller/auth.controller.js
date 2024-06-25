const UserModel = require('../models/UserModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailerConfig');
const OTPModel = require('../models/OTPModel');
const crypto = require('crypto');
const userDetailModel = require('../models/UserDetailModel');
const logger = require('../config/logger');
const notificationController = require('../controller/notification.controller')
const notificationModel = require('../models/NotificationModel');

const generateOTP = () => crypto.randomBytes(3).toString('hex');

//* -------------- Register ----------------------
const emailVerify = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await UserModel.getUserByEmail(email);
        if (existingUser) {
            logger.warn(`User already exists with email: ${email}`);
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        const otp = generateOTP();
        await OTPModel.storeOTP(email, otp);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email OTP Confirmation',
            html: `<p>Your OTP code is: ${otp}</p>`
        });

        logger.info(`OTP sent to email: ${email}`);
        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        logger.error('Verify Email Error:', error);
        res.status(500).json({ error: 'Verify Email Error' });
    }
};

const verifyEmailOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const validOTP = await OTPModel.verifyOTP(email, otp);
        if (!validOTP) {
            logger.warn(`Invalid OTP for email: ${email}`);
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        await UserModel.confirmEmail(email);
        logger.info(`Email verified for: ${email}`);
        res.status(200).json({ message: 'Email verified, you can now register' });
    } catch (error) {
        logger.error('Verify OTP Email Failed:', error);
        res.status(500).json({ error: 'Verify OTP Email Failed' });
    }
};

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await UserModel.getUserByEmail(email);
        if (!existingUser) {
            logger.warn(`Attempt to register without verifying email: ${email}`);
            return res.status(400).json({ error: 'You can not register because you do not verify your email' });
        }

        if (existingUser.emailConfirmed === 'false') {
            logger.warn(`Attempt to register with unverified email: ${email}`);
            return res.status(400).json({ error: 'You can not register because you do not verify your email' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = {
            username,
            email,
            password: hashedPassword,
            role: 'customer',
            register_at: new Date()
        };

        await UserModel.addUser(newUser);
        const user_id = existingUser._id.toString()
        //* Create Notification For Basic Register
        const notification = {
            user_id: user_id,
            message: "Create basic account successfully",
            type: 'authentication',
            status: 'unread'
        }
        await notificationModel.createNotification(notification)
        logger.info(`User registered successfully: ${username}`);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        logger.error('Register User Error:', error);
        res.status(500).json({ error: 'Register User Error' });
    }
};

//* --------------- Login ----------------------
const loginUser = async (req, res) => {
    try {
        logger.info('Handling request for loginUser');
        const { email, password } = req.body;
        const user = await UserModel.getUserByEmail(email);
        if (!user) {
            logger.warn(`Invalid email attempted: ${email}`);
            return res.status(401).json({ error: 'Invalid email' });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            logger.warn(`Invalid password attempted for email: ${email}`);
            return res.status(401).json({ error: 'Invalid password' });
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
        await UserModel.updateRefreshToken(user._id, refreshToken);

        logger.info(`User logged in: ${email}`);
        res.status(200).json({
            accessToken,
            refreshToken,
            currentUser: { user_id: user._id, username: user.username, role: user.role }
        });
    } catch (error) {
        logger.error('Login User Error:', error);
        res.status(500).json({ error: 'Login User Error' });
    }
};

const loginGoogleUser = async (req, res) => {
    const { sub, email, name, picture } = req.body;
    try {
        let user = await UserModel.getUserBySub(sub);
        if (!user) {
            const newUser = {
                oauth: {
                    google: {
                        gg_id: sub,
                        gg_email: email,
                    }
                },
                role: 'customer',
                register_at: new Date()
            };
            const userId = await UserModel.addGoogleUser(newUser);
            const newUserDetail = {
                user_id: userId.toString(),
                name,
                avatar_uri: picture
            };
            await userDetailModel.addUserDetail(newUserDetail);
            user = await UserModel.getUserById(userId);
            const notification = {
                user_id: userId.toString(),
                message: 'Create google account successfully',
                type: 'authentication',
                status: 'unread'
            }
            await notificationModel.createNotification(notification)
        }
        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
        await UserModel.updateRefreshToken(user._id, refreshToken);
        
        logger.info(`User logged in with Google: ${email}`);
        res.status(200).json({
            accessToken,
            refreshToken,
            currentUser: { user_id: user._id.toString(), username: user.username || "", role: user.role }
        });
    } catch (error) {
        logger.error('Register with Google Error:', error);
        res.status(500).json({ error: 'Register with Google Error' });
    }
};

//* --------------- Logout --------------------
const logoutUser = async (req, res) => {
    const userId = req.user._id;
    try {
        const updateData = {
            refreshToken: '',
            last_login: new Date()
        };

        await UserModel.logoutUser(userId, updateData);
        logger.info(`User logged out: ${userId}`);
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        logger.error('Error in logout:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    emailVerify,
    registerUser,
    verifyEmailOTP,
    loginUser,
    loginGoogleUser,
    logoutUser
};
