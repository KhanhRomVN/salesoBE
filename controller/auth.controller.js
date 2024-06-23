const UserModel = require('../models/UserModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailerConfig');
const OTPModel = require('../models/OTPModel');
const crypto = require('crypto');

const generateOTP = () => crypto.randomBytes(3).toString('hex');

const emailVerify = async (req, res) => {
    const { email } = req.body;
    try {
        const existingUser = await UserModel.getUserByEmail(email);
        if (existingUser) {
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

        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error('Verify Email Error:', error);
        res.status(500).json({ error: 'Verify Email Error' });
    }
};

const verifyEmailOTP = async (req, res) => {
    const { email, otp } = req.body;
    try {
        
        const validOTP = await OTPModel.verifyOTP(email, otp);
        if (!validOTP) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        await UserModel.confirmEmail(email);
        res.status(200).json({ message: 'Email verified, you can now register' });
    } catch (error) {
        console.error('Verify OTP Email Failed:', error);
        res.status(500).json({ error: 'Verify OTP Email Failed' });
    }
};

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await UserModel.getUserByEmail(email);
        if (!existingUser) {
            return res.status(400).json({ error: 'You can not register because you do not verify your email' });
        }

        if (existingUser.emailConfirmed === 'false') {
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
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Register User Error:', error);
        res.status(500).json({ error: 'Register User Error' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email' });
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
        await UserModel.updateRefreshToken(user._id, refreshToken);

        res.status(200).json({
            accessToken,
            refreshToken,
            currentUser: { user_id: user._id, username: user.username, role: user.role }
        });
    } catch (error) {
        console.error('Login User Error:', error);
        res.status(500).json({ error: 'Login User Error' });
    }
};

const logoutUser = async (req, res) => {
    const userId = req.user._id;
    try {
        const updateData = {
            refreshToken: '',
            last_login: new Date()
        };

        await UserModel.logoutUser(userId, updateData);
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error in logout:', error);
        res.status(500).json({ error: 'Internal server error' });
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
                        email,
                    }
                },
                role: 'customer',
                register_at: new Date()
            };
            const userId = await UserModel.addUser(newUser);
            const newUserDetail = {
                user_id: userId,
                name,
                avatar_uri: picture
            };
            await userDetailModel.addUserDetail(newUserDetail);
            user = await UserModel.getUserById(userId);
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
        await UserModel.updateRefreshToken(user._id, refreshToken);

        res.status(200).json({
            accessToken,
            refreshToken,
            currentUser: { user_id: user._id.toString(), username: user.username || "", role: user.role }
        });
    } catch (error) {
        console.error('Register with Google Error:', error);
        res.status(500).json({ error: 'Register with Google Error' });
    }
};

module.exports = {
    emailVerify,
    registerUser,
    verifyEmailOTP,
    loginUser,
    logoutUser,
    loginGoogleUser,
};
