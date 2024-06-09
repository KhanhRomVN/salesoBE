const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const authToken = async (req, res, next) => {
  try {
    const token = req.header('accessToken');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - No Token Provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized - Invalid Token' });
    }

    const user = await UserModel.getUserById(decoded.userId);
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error in authToken middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authToken;
