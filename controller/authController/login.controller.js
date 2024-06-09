const UserModel = require('../../models/UserModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function loginUser(request, response) {
  try {
    const { email, password } = request.body;

    const user = await UserModel.getUserByEmail(email);
    if (!user) {
      return response.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return response.status(401).json({ error: 'Invalid email or password' });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

    await UserModel.updateUserById(user._id, { refreshToken });

    const { password: userPassword, ...userData } = user;

    response.status(200).json({ accessToken, refreshToken, user: userData });
  } catch (error) {
    console.error('Error in loginUser:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = loginUser;
