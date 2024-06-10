const UserModel = require('../models/UserModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { username, name, age, email, password, sdt, address } = req.body;

        const existingUser = await UserModel.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = {
            username,
            name,
            age,
            email,
            password: hashedPassword,
            role: 'customer', // Default role is 'customer'
            sdt,
            address,
            createdAt: new Date(),
            updatedAt: new Date(),
            refreshToken: '', // Initialize refresh token as empty string
        };

        await UserModel.insertUser(newUser);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

    await UserModel.updateRefreshToken(user._id, refreshToken);

    const { password: userPassword, ...userData } = user;

    res.status(200).json({ accessToken, refreshToken, user: userData });
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const logoutUser = async (req, res) => {
    try {
      const userId = req.user._id;
      const updateData = {
        refreshToken: '', 
        lastAccess: new Date() 
      };
  
      await UserModel.updateUserById(userId, updateData);
  
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Error in logout:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

module.exports = {
    loginUser,
    registerUser,
    logoutUser
};
