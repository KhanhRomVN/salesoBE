const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/mongoDB');

const COLLECTION_NAME = 'users';
const COLLECTION_SCHEMA = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('admin', 'seller', 'customer').default('customer'),
  register_at: Joi.date().required(),
  last_login: Joi.date().default(() => new Date()),
  update_at: Joi.date().default(() => new Date()),
  refreshToken: Joi.string().default("")
}).options({ abortEarly: false });

const validateUser = (userData) => {
  const validation = COLLECTION_SCHEMA.validate(userData);
  if (validation.error) {
    throw new Error(validation.error.details.map(detail => detail.message).join(', '));
  }
};

/* Add */
const addUser = async (userData) => {
  try {
    validateUser(userData);
    const db = getDB();
    const result = await db.collection(COLLECTION_NAME).insertOne(userData);
    return result.insertedId.toString()
  } catch (error) {
    console.error("Error in insertUser: ", error);
    throw error;
  }
};

/* Get */
const getUserById = async (userId) => {
  try {
    const db = getDB();
    return await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(userId) });
  } catch (error) {
    console.error("Error in getUserById: ", error);
  }
};

const getUserByUserName = async (username) => {
  try {
    const db = getDB();
    return await db.collection(COLLECTION_NAME).findOne({ username });
  } catch (error) {
    console.error("Error in getUserById: ", error);
  }
}

const getUserByEmail = async (email) => {
  try {
    const db = getDB();
    return await db.collection(COLLECTION_NAME).findOne({ email });
  } catch (error) {
    console.error("Error in getUserByEmail: ", error);
  }
};

const getUsersByArrayOfId = async (userIds) => {
  try {
    const db = getDB();
    const objectIds = userIds.map(id => new ObjectId(id));
    return await db.collection(COLLECTION_NAME).find({ _id: { $in: objectIds } }).toArray();
  } catch (error) {
    console.error("Error in getUsersByIds: ", error);
  }
};

const getAllUsers = async () => {
  try {
    const db = getDB();
    return await db.collection(COLLECTION_NAME).find().toArray();
  } catch (error) {
    console.error("Error in getAllUsers: ", error);
  }
};

/* Update */
const updateRole = async (userId) => {
  try {
    const db = getDB();
    await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role: 'seller' } }
    );
  } catch (error) {
    console.error("Error in updateRole: ", error);
    throw error;
  }
};

const updateUser = async (user_id, userData) => {
  try {
    const db = getDB();
    const updateData = {};

    if (userData.username) {
      const usernameExists = await db.collection(COLLECTION_NAME).findOne({
        username: userData.username,
        _id: { $ne: new ObjectId(user_id) }
      });
      if (usernameExists) {
        throw new Error("Username already exists");
      }
      updateData.username = userData.username;
    }

    if (userData.email) {
      const emailExists = await db.collection(COLLECTION_NAME).findOne({
        email: userData.email,
        _id: { $ne: new ObjectId(user_id) } 
      });
      if (emailExists) {
        throw new Error("Email already exists");
      }
      updateData.email = userData.email;
    }

    if (userData.password) {
      updateData.password = userData.password;
    }

    updateData.update_at = new Date();

    if (Object.keys(updateData).length === 0) {
      throw new Error("No valid fields to update");
    }

    await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(user_id) },
      { $set: updateData }
    );
  } catch (error) {
    console.error("Error in updateUser: ", error);
    throw error;
  }
};

const updateRefreshToken = async (userId, refreshToken) => {
  try {
    const db = getDB();
    await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      { $set: { refreshToken }, $currentDate: { last_login: true } }
    );
  } catch (error) {
    console.error("Error in updateRefreshToken: ", error);
    throw error;
  }
};

/* Del */
const deleteUserById = async (userId) => {
  try {
    const db = getDB();
    await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(userId) });
  } catch (error) {
    console.error("Error in deleteUserById: ", error);
  }
};

const delUsersByArrayOfId = async (userIds) => {
  const db = getDB();
  try {
    const objectIds = userIds.map(id => new ObjectId(id));
    await db.collection(COLLECTION_NAME).deleteMany({ _id: { $in: objectIds } });
  } catch (error) {
    console.error("Error in delUsersByArrayOfId: ", error);
    throw error;
  }
};

/* Other */
const logoutUser = async (user_id, updateData) => {
  const db = getDB(); 
  try {
    await db.collection('users').updateOne(
      { _id: user_id },
      { $set: updateData }
    );
  } catch (error) {
    console.error('Error in UserModel.logoutUser:', error);
    throw error;
  }
}

const getAllFriend = async () => {
  const db = getDB();
  try {
    const userListData = await db.collection(COLLECTION_NAME).find({}, { projection: { username: 1, email: 1, _id: 0 } }).toArray();
    return userListData;
  } catch (error) {
    console.error('Error in getAllFriend:', error);
    throw error;
  }
}

module.exports = {
  addUser,
  getUserById,
  getUserByUserName,
  getUserByEmail,
  deleteUserById,
  getAllUsers,
  getUsersByArrayOfId,
  delUsersByArrayOfId,
  updateRole,
  updateRefreshToken,
  logoutUser,
  updateUser,
  getAllFriend
};
