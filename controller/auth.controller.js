const UserModel = require('../models/UserModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailerConfig');
const OTPModel = require('../models/OTPModel');
const crypto = require('crypto');
const userDetailModel = require('../models/UserDetailModel');
const logger = require('../config/logger');

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

const registerUserWithOTP = async (req, res) => {
    const { email, otp, username, password } = req.body;
    try {
        const validOTP = await OTPModel.verifyOTP(email, otp);
        if (!validOTP) {
            logger.warn(`Invalid OTP for email: ${email}`);
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        const existingEmail = await UserModel.getUserByEmail(email);
        const existingUsername = await UserModel.getUserByUsername(username);
        if (existingEmail) {
            logger.warn(`Unable to register because email already exists: ${email}`);
            return res.status(400).json({ error: 'You cannot register because the email already exists' });
        }

        if (existingUsername) {
            logger.warn(`Unable to register because username already exists: ${username}`);
            return res.status(400).json({ error: 'You cannot register because the username already exists' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const userData = {
            username,
            email,
            emailConfirmed: 'true',
            password: hashedPassword,
            role: 'customer',
            register_at: new Date()
        };

        await UserModel.registerUser(email, userData);
        const user = await UserModel.getUserByEmail(email);
        const user_id = user._id.toString();
        const userDetailData = {
            user_id,
            friends_request: [],
            friends: [],
            blocklist: []
        };

        await userDetailModel.addUserDetail(userDetailData);
        logger.info(`User registered successfully: ${username}`);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        logger.error('Register User with OTP Failed:', error);
        res.status(500).json({ error: 'Register User with OTP Failed' });
    }
};

//* --------------- Login ----------------------
const loginUser = async (req, res) => {
    try {
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
    registerUserWithOTP,
    loginUser,
    loginGoogleUser,
    logoutUser
};
