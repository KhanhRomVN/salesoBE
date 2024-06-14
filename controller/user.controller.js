const bcryptjs = require('bcryptjs');
const UserModel = require('../models/UserModel');
const UserModelDetail = require('../models/UserDetailModel');

const getUserDetail = async (req, res) => {
  const { username } = req.body
  try {
    const user = await UserModel.getUserByUserName(username)
    const user_id = user._id.toString()
    const userDetail = await UserModelDetail.getUserDetailByUserId(user_id)
    const userData = { 
      user_id: user_id,
      username: user.username, 
      role: user.role, 
      name: userDetail.name, 
      about: userDetail.about, 
      address: userDetail.address, 
      avatar_uri: userDetail.avatar_uri, 
      background_uri: userDetail.background_uri 
    }
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: "Error getUserDetail" });
  }
  
}

const updateUser = async (req, res) => {
  const user_id = req.user._id.toString();
  const {
    username, email, password, name, age, gender, about,
    phone_number, address, avatar_uri, background_uri
  } = req.body;

  const user = {};
  if (username) user.username = username;
  if (email) user.email = email;
  if (password) user.password = password;

  const userDetail = {};
  if (name) userDetail.name = name;
  if (age) userDetail.age = age;
  if (gender) userDetail.gender = gender;
  if (about) userDetail.about = about;
  if (phone_number) userDetail.phone_number = phone_number;
  if (address) userDetail.address = address;
  if (avatar_uri) userDetail.avatar_uri = avatar_uri;
  if (background_uri) userDetail.background_uri = background_uri;

  try {
    if (user.password) {
      const hashedPassword = await bcryptjs.hash(password, 10);
      if (Object.keys(user).length > 0) {
        user.password = hashedPassword
        await UserModel.updateUser(user_id, user);
      }
    }

    if (Object.keys(userDetail).length > 0) {
      await UserModelDetail.updateUser(user_id, userDetail);
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({ message: "Error updating user" });
  }
};

const listFriend = async (req, res) => {
  const user_id = req.user._id.toString();
  try {
    const friends = await UserModelDetail.getListFriends(user_id);
    res.status(200).json({ friends });
  } catch (error) {
    res.status(500).json({ message: "Error fetching friend list" });
  }
};

const updateRole = async (req, res) => {
  const user_id = req.user._id.toString();
  try {
    await UserModel.updateRole(user_id);
    res.status(200).json({ message: "Update to seller successfully!" });
  } catch (error) {
    console.error("Error in updateRole: ", error);
    res.status(500).json({ message: "Error updating role" });
  }
};

const addFriend = async (req, res) => {
  const { friend_id } = req.body;
  const user_id = req.user._id.toString();
  try {
    await UserModelDetail.addFriend(user_id, friend_id);
    res.status(200).json({ message: "Friend added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding friend." });
  }
};

const delFriend = async (req, res) => {
  const { friend_id } = req.body;
  const user_id = req.user._id.toString();
  try {
    await UserModelDetail.delFriend(user_id, friend_id);
    res.status(200).json({ message: "Friend deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting friend." });
  }
};

module.exports = {
  getUserDetail,
  updateUser,
  updateRole,
  listFriend,
  addFriend,
  delFriend
};
