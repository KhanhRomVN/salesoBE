const UserModel = require('../models/UserModel');
const userDetailModel = require('../models/UserDetailModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailerConfig');
const generationToken = require('../config/generationToken')

const registerUser = async (req, res) => {
    const { username, email, password, name, age, gender } = req.body;
    try {
        const existingUser = await UserModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = {
            username,
            email,
            password: hashedPassword,
            role: 'customer',
            register_at: new Date()
        };

        const user_id = await UserModel.addUser(newUser);

        const newUserDetail = {
            user_id,
            name,
            age,
            gender,
        };
        await userDetailModel.addUserDetail(newUserDetail);

        const emailToken = generationToken.generateEmailToken(user_id);
        const url = `${process.env.FRONTEND_URL}/confirmation/`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Confirmation',
            html: `<h2>Welcome!</h2><p>Please click the link to confirm your email: <a href="${url}">${url}</a></p>`
        });

        res.status(201).json({ message: 'User registered successfully, please check your email to confirm your account.', emailToken });
    } catch (error) {
        console.error('Register User Error:', error);
        res.status(500).json({ error: 'Register User Error' });
    }
};

const confirmEmail = async (req, res) => {
    const { emailToken } = req.body
    try {
        const decoded = jwt.verify(emailToken, process.env.EMAIL_SECRET_KEY);
        console.log(decoded);
        const user_id = decoded.userId;
        console.log(user_id);
        await UserModel.confirmEmail(user_id);

        res.status(200).json({ message: 'Email confirmed successfully' });
    } catch (error) {
        console.error('Email confirmation failed:', error);
        res.status(400).json({ error: 'Email confirmation failed' });
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

        res.status(200).json({ accessToken, refreshToken, currentUser: { user_id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        console.error('Login User Error:', error);
        res.status(500).json({ error: 'Login User Error' });
    }
};

const logoutUser = async (req, res) => {
    const user_id = req.user._id;
    try {
        const updateData = {
            refreshToken: '',
            last_login: new Date()
        };

        await UserModel.logoutUser(user_id, updateData);
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
            const user_id = await UserModel.addUser(newUser);
            const newUserDetail = {
                user_id,
                name,
                avatar_uri: picture
            };
            await userDetailModel.addUserDetail(newUserDetail);
            user = await UserModel.getUserById(user_id); // Retrieve the new user
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
        await UserModel.updateRefreshToken(user._id, refreshToken);

        res.status(200).json({ accessToken, refreshToken, currentUser: { user_id: user._id.toString(), username: user.username || "", role: user.role } });
    } catch (error) {
        console.error('Register with Google Error:', error);
        res.status(500).json({ error: 'Register with Google Error' });
    }
};

module.exports = {
    registerUser,
    confirmEmail,
    loginUser,
    logoutUser,
    loginGoogleUser,
};