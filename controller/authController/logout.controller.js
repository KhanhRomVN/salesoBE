const UserModel = require('../../models/UserModel');

const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = {
      refreshToken: '', // Clear refresh token
      lastAccess: new Date() // Update last access time
    };

    await UserModel.updateUserById(userId, updateData);

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error in logout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = logoutUser;
