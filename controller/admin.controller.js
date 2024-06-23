const AdminModel = require('../models/AdminModel')

const getAllUsers = async (req, res) => {
  try {
    const users = await AdminModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers: ", error);
    res.status(500).send("Error fetching users.");
  }
};

module.exports = {
  getAllUsers,
};
