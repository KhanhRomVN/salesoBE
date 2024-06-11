const UserModel = require('../models/UserModel');

const updateRole = async (req, res) => {
    const userId = req.user._id.toString();
    console.log(userId);
    try {
        await UserModel.updateRole(userId);
        res.status(200).send("Role updated successfully.");
    } catch (error) {
        console.error("Error in updateRole: ", error);
        res.status(500).send("Error updating role.");
    }
};

const updateS = async (req, res) => {
    const value = req.body;
    const userId = req.user._id.toString();
    const updateFields = {};

    if (value.name) updateFields.name = value.name;
    if (value.username) updateFields.username = value.username;
    if (value.email) updateFields.email = value.email;
    if (value.age) updateFields.age = value.age;
    if (value.sdt) updateFields.sdt = value.sdt;
    if (value.address) updateFields.address = value.address;

    try {
        await UserModel.updateUserFields(userId, updateFields);
        res.status(200).send("User updated successfully.");
    } catch (error) {
        console.error("Error in updateS: ", error);
        res.status(500).send("Error updating user.");
    }
};

const getFriends = async (req, res) => {
    const userId = req.user._id.toString();
    try {
        const friends = await UserModel.getFriends(userId);
        res.status(200).json(friends);
    } catch (error) {
        console.error("Error in updateS: ", error);
        res.status(500).send("Error updating user.");
    }
}


module.exports = {
    updateRole,
    updateS,
    getFriends
};
