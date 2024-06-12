const UserModel = require('../models/UserModel');

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers: ", error);
    res.status(500).send("Error fetching users.");
  }
};

const delUser = async (req, res) => {
  const { userId } = req.body;
  try {
    await UserModel.deleteUserById(userId);
    res.status(200).send("User deleted successfully.");
  } catch (error) {
    console.error("Error in delUser: ", error);
    res.status(500).send("Error deleting user.");
  }
};

const delUsers = async (req, res) => {
  const { arrayOfId } = req.body;
  try {
    await UserModel.delUsersByArrayOfId(arrayOfId);
    res.status(200).send("Users deleted successfully.");
  } catch (error) {
    console.error("Error in delUsers: ", error);
    res.status(500).send("Error deleting users.");
  }
};

module.exports = {
  getAllUsers,
  delUser,
  delUsers
};
