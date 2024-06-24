const { ObjectId } = require('mongodb');
const { getDB } = require('../config/mongoDB');

const COLLECTION_NAME = 'user_detail';

//* Update data detail user
const updateName = async (user_id, name) => {
    try {
        const db = getDB();
        await db.collection(COLLECTION_NAME).updateOne(
            { user_id },
            { $set: { name }}
        );
    } catch (error) {
        console.error("Error updating name: ", error);
        throw error;
    }
};

const updateAge = async (user_id, age) => {
    try {
        const db = getDB();
        await db.collection(COLLECTION_NAME).updateOne(
            { user_id },
            { $set: { age }}
        );
    } catch (error) {
        console.error("Error updating age: ", error);
        throw error;
    }
};

const updateGender = async (user_id, gender) => {
    try {
        const db = getDB();
        await db.collection(COLLECTION_NAME).updateOne(
            { user_id },
            { $set: { gender }}
        );
    } catch (error) {
        console.error("Error updating gender: ", error);
        throw error;
    }
};

const updateAbout = async (user_id, about) => {
    try {
        const db = getDB();
        await db.collection(COLLECTION_NAME).updateOne(
            { user_id },
            { $set: { about } }
        );
    } catch (error) {
        console.error("Error updating about: ", error);
        throw error;
    }
};
const updatePhone = async (user_id, phone_number) => {
    try {
        const db = getDB();
        await db.collection(COLLECTION_NAME).updateOne(
            { user_id },
            { $set: { phone_number }}
        );
    } catch (error) {
        console.error("Error updating phone number: ", error);
        throw error;
    }
};

const updateAddress = async (user_id, address) => {
    try {
        const db = getDB();
        await db.collection(COLLECTION_NAME).updateOne(
            { user_id },
            { $set: { address }}
        );
    } catch (error) {
        console.error("Error updating address: ", error);
        throw error;
    }
};

const updateAvatar = async (user_id, avatar_uri) => {
    try {
        const db = getDB();
        await db.collection(COLLECTION_NAME).updateOne(
            { user_id },
            { $set: { avatar_uri }}
        );
    } catch (error) {
        console.error("Error updating avatar: ", error);
        throw error;
    }
};


//* Get data user detail
const getUserDetailByUserId = async (user_id) => {
    try {
        const db = getDB();
        return await db.collection(COLLECTION_NAME).findOne({ user_id });
    } catch (error) {
        console.error("Error in getUserDetailByUserId: ", error);
        throw error;
    }
};

const getListFriends = async (user_id) => {
    try {
        const db = getDB();
    
        const user = await db.collection(COLLECTION_NAME).findOne({ user_id: user_id });
        if (!user) {
          throw new Error(`User with ID ${user_id} not found`);
        }
    
        return user.friendList;
      } catch (error) {
        console.error("Error in getListFriends: ", error);
        throw error;
      }
};

module.exports = {
    updateName,
    updateAge,
    updateGender,
    updateAbout,
    updatePhone,
    updateAddress,
    updateAvatar,
    getUserDetailByUserId,
    getListFriends,
};
