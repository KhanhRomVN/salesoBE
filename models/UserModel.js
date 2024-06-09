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
  sdt: Joi.string().pattern(/^[0-9]{10,11}$/).required(), // Assumes Vietnamese phone number format
  address: Joi.string().required(),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date())
}).options({ abortEarly: false });

const insertUser = async (userData) => {
    try {
      const validation = COLLECTION_SCHEMA.validate(userData);
      if (validation.error) {
        throw new Error(validation.error.details.map(detail => detail.message).join(', '));
      }
      const db = getDB();
      const result = await db.collection(COLLECTION_NAME).insertOne(userData);
      return result.insertedId; // Trả về ID của người dùng mới được chèn vào
    } catch (error) {
      console.error("Error in insertUser: ", error);
      throw error;
    }
  };

const getUserById = async (userId) => {
  try {
    const db = getDB();
    return await db.collection(COLLECTION_NAME).findOne({ _id: ObjectId(userId) });
  } catch (error) {
    console.error("Error in getUserById: ", error);
  }
};

const getUserByUsername = async (username) => {
  try {
    const db = getDB();
    return await db.collection(COLLECTION_NAME).findOne({ username });
  } catch (error) {
    console.error("Error in getUserByUsername: ", error);
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

const updateUserById = async (userId, updateData) => {
  try {
    const db = getDB();
    await db.collection(COLLECTION_NAME).updateOne(
      { _id: ObjectId(userId) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
  } catch (error) {
    console.error("Error in updateUserById: ", error);
  }
};

const updateUserByUsername = async (username, updateData) => {
  try {
    const db = getDB();
    await db.collection(COLLECTION_NAME).updateOne(
      { username },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
  } catch (error) {
    console.error("Error in updateUserByUsername: ", error);
  }
};

const updateUserByEmail = async (email, updateData) => {
  try {
    const db = getDB();
    await db.collection(COLLECTION_NAME).updateOne(
      { email },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
  } catch (error) {
    console.error("Error in updateUserByEmail: ", error);
  }
};

const deleteUserById = async (userId) => {
  try {
    const db = getDB();
    await db.collection(COLLECTION_NAME).deleteOne({ _id: ObjectId(userId) });
  } catch (error) {
    console.error("Error in deleteUserById: ", error);
  }
};

const deleteUserByEmail = async (email) => {
  try {
    const db = getDB();
    await db.collection(COLLECTION_NAME).deleteOne({ email });
  } catch (error) {
    console.error("Error in deleteUserByEmail: ", error);
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

const getUsersByIds = async (userIds) => {
  try {
    const db = getDB();
    const objectIds = userIds.map(id => ObjectId(id));
    return await db.collection(COLLECTION_NAME).find({ _id: { $in: objectIds } }).toArray();
  } catch (error) {
    console.error("Error in getUsersByIds: ", error);
  }
};

const updateUsersByIds = async (userIds, updateData) => {
  try {
    const db = getDB();
    const objectIds = userIds.map(id => ObjectId(id));
    await db.collection(COLLECTION_NAME).updateMany(
      { _id: { $in: objectIds } },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
  } catch (error) {
    console.error("Error in updateUsersByIds: ", error);
  }
};

const deleteUsersByIds = async (userIds) => {
  try {
    const db = getDB();
    const objectIds = userIds.map(id => ObjectId(id));
    await db.collection(COLLECTION_NAME).deleteMany({ _id: { $in: objectIds } });
  } catch (error) {
    console.error("Error in deleteUsersByIds: ", error);
  }
};

module.exports = {
  insertUser,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  updateUserById,
  updateUserByUsername,
  updateUserByEmail,
  deleteUserById,
  deleteUserByEmail,
  getAllUsers,
  getUsersByIds,
  updateUsersByIds,
  deleteUsersByIds
};
