const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { getDB } = require('../config/mongoDB');

// Define Collection (Name & Schema)
const COLLECTION_NAME = 'users';
const COLLECTION_SCHEMA = Joi.object({
  username: Joi.string().required(),
  name: Joi.string().required(),
  age: Joi.number().integer().min(0).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('admin', 'seller', 'customer').default('customer'),
  sdt: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
  address: Joi.string().required(),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date()),
  refreshToken: Joi.string().allow('').optional()
}).options({ abortEarly: false });

const validateUser = (userData) => {
  const validation = COLLECTION_SCHEMA.validate(userData);
  if (validation.error) {
    throw new Error(validation.error.details.map(detail => detail.message).join(', '));
  }
};

const insertUser = async (userData) => {
  try {
    validateUser(userData);
    const db = getDB();
    const result = await db.collection(COLLECTION_NAME).insertOne(userData);
    return result.insertedId;
  } catch (error) {
    console.error("Error in insertUser: ", error);
    throw error;
  }
};

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

const updateUserFields = async (userId, updateFields) => {
  try {
    const db = getDB();
    await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateFields, $currentDate: { updatedAt: true } }
    );
  } catch (error) {
    console.error("Error in updateUserFields: ", error);
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const db = getDB();
    return await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(userId) });
  } catch (error) {
    console.error("Error in getUserById: ", error);
  }
};

const getUserByEmail = async (email) => {
  try {
    const db = getDB();
    return await db.collection(COLLECTION_NAME).findOne({ email });
  } catch (error) {
    console.error("Error in getUserByEmail: ", error);
  }
};

const deleteUserById = async (userId) => {
  try {
    const db = getDB();
    await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(userId) });
  } catch (error) {
    console.error("Error in deleteUserById: ", error);
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

const getUsersByArrayOfId = async (userIds) => {
  try {
    const db = getDB();
    const objectIds = userIds.map(id => new ObjectId(id));
    return await db.collection(COLLECTION_NAME).find({ _id: { $in: objectIds } }).toArray();
  } catch (error) {
    console.error("Error in getUsersByIds: ", error);
  }
};

const updateRefreshToken = async (userId, refreshToken) => {
  try {
    const db = getDB();
    await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      { $set: { refreshToken }, $currentDate: { updatedAt: true } }
    );
  } catch (error) {
    console.error("Error in updateRefreshToken: ", error);
    throw error;
  }
};

const getListFriends = async (userId) => {
  try {
    const db = getDB();
    const user = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(userId) });
    const friends = user.friends;
    
    // Tạo mảng chứa các promise để lấy dữ liệu từng người bạn và chỉ chọn các trường mong muốn
    const friendDataPromises = friends.map(async (friendId) => {
      const friendData = await db.collection(COLLECTION_NAME).findOne(
        { _id: new ObjectId(friendId) }, 
        { projection: { _id: 1, username: 1, name: 1 } } // chỉ chọn các trường mong muốn
      );
      return friendData;
    });

    const friendData = await Promise.all(friendDataPromises);
    return friendData;
  } catch (error) {
    console.error("Error in getUserById: ", error);
    throw error;
  }
}

const addFriend = async (userId, friendId) => {
  try {
    const db = getDB();
    await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { friends: new ObjectId(friendId) } }
    );
  } catch (error) {
    console.error("Error in addFriend: ", error);
    throw error;
  }
};

const delFriend = async (userId, friendId) => {
  try {
    const db = getDB();
    await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { friends: new ObjectId(friendId) } }
    );
  } catch (error) {
    console.error("Error in delFriend: ", error);
    throw error;
  }
};

const delUsersByArrayOfId = async (userIds) => {
  try {
    const db = getDB();
    const objectIds = userIds.map(id => new ObjectId(id));
    await db.collection(COLLECTION_NAME).deleteMany({ _id: { $in: objectIds } });
  } catch (error) {
    console.error("Error in delUsersByArrayOfId: ", error);
    throw error;
  }
};

module.exports = {
  insertUser,
  getUserById,
  getUserByEmail,
  deleteUserById,
  getAllUsers,
  getUsersByArrayOfId,
  delUsersByArrayOfId,
  updateRole,
  updateUserFields,
  updateRefreshToken,
  getListFriends,
  addFriend,
  delFriend
};
