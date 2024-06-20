const UserModel = require('../models/UserModel');
const userDetailModel = require('../models/UserDetailModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        }
        await userDetailModel.addUserDetail(newUserDetail)

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Register User Error' });
    }
}

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
        res.status(500).json({ error: 'Login User Error' });
    }
}

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
        let user = await UserModel.getUserByEmail(email);
        if (!user) {
            const newUser = {
                email,
                oauth: {
                    google: {
                        id: sub,
                        email,
                        token: idToken
                    }
                },
                role: 'customer',
                register_at: new Date()
            };
            user = await UserModel.addUser(newUser);

            const newUserDetail = {
                user_id: user._id,
                name,
                avatar_uri: picture
            };
            await userDetailModel.addUserDetail(newUserDetail);
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
        await UserModel.updateRefreshToken(user._id, refreshToken);

        res.status(200).json({ accessToken, refreshToken, currentUser: { user_id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: 'Login with Google Error' });
    }
};

const registerGoogleUser = async (req, res) => {
  const { sub, email, name, picture } = req.body;
    try {
        let user = await UserModel.getUserByEmail(email);
        if (user) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        const newUser = {
            email,
            oauth: {
                google: {
                    id: sub,
                    email,
                    token: idToken
                }
            },
            role: 'customer',
            register_at: new Date()
        };
        user = await UserModel.addUser(newUser);

        const newUserDetail = {
            user_id: user._id,
            name,
            avatar_uri: picture
        };
        await userDetailModel.addUserDetail(newUserDetail);

        res.status(201).json({ message: 'User registered with Google successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Register with Google Error' });
    }
};

module.exports = {
    loginUser,
    registerUser,
    logoutUser,
    loginGoogleUser,
    registerGoogleUser
};
