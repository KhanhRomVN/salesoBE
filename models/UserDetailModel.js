const { getDB } = require('../config/mongoDB');
const Joi = require('joi');
const { ObjectId } = require('mongodb');
const UserModel = require('./UserModel');

const COLLECTION_NAME = 'user_details';
const COLLECTION_SCHEMA = Joi.object({
    user_id: Joi.string().required(),
    name: Joi.string().optional(),
    age: Joi.number().integer().min(0).optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    address: Joi.string().optional(),
    about: Joi.string().optional(),
    avatar: Joi.string().uri().optional(),
    friends_request: Joi.array().items(Joi.string()).default([]),
    friends: Joi.array().items(Joi.string()).default([]),
    blocklist: Joi.array().items(Joi.string()).default([]),
}).options({ abortEarly: false });


const validateUserDetail = (userDetailData) => {
    const validation = COLLECTION_SCHEMA.validate(userDetailData);
    if (validation.error) {
        throw new Error(validation.error.details.map(detail => detail.message).join(', '));
    }
};

const addUserDetail = async (userDetailData) => {
    try {
        validateUserDetail(userDetailData);
        const db = getDB();
        return await db.collection(COLLECTION_NAME).insertOne(userDetailData);
    } catch (error) {
        console.error('Error adding user detail:', error);
        throw new Error('Failed to add user detail');
    }
};

const getUserDetailByUserId = async (userId) => {
    try {
        const db = getDB();
        return await db.collection(COLLECTION_NAME).findOne({ user_id: new ObjectId(userId) });
    } catch (error) {
        console.error('Error getting user detail:', error);
        throw new Error('Failed to get user detail');
    }
};

const updateUserDetail = async (userId, updateData) => {
    try {
        validateUserDetail(updateData);
        const db = getDB();
        return await db.collection(COLLECTION_NAME).updateOne({ user_id: new ObjectId(userId) }, { $set: updateData });
    } catch (error) {
        console.error('Error updating user detail:', error);
        throw new Error('Failed to update user detail');
    }
};

const updateName = (userId, { name }) => updateUserDetail(userId, { name });
const updateAge = (userId, { age }) => updateUserDetail(userId, { age });
const updateGender = (userId, { gender }) => updateUserDetail(userId, { gender });
const updateAddress = (userId, { address }) => updateUserDetail(userId, { address });
const updateAbout = (userId, { about }) => updateUserDetail(userId, { about });
const updateAvatar = (userId, { avatar }) => updateUserDetail(userId, { avatar });

const sendFriendRequest = async (userId, friendId) => {
    try {
        const db = getDB();
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(userId) },
            { $push: { friends_request: friendId } }
        );
    } catch (error) {
        console.error('Error sending friend request:', error);
        throw new Error('Failed to send friend request');
    }
};

const acceptFriendRequest = async (userId, friendId) => {
    try {
        const db = getDB();
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(userId) },
            { 
                $addToSet: { friends: friendId },
                $pull: { friends_request: friendId }
            }
        );
    } catch (error) {
        console.error('Error accepting friend request:', error);
        throw new Error('Failed to accept friend request');
    }
};

const refuseFriendRequest = async (userId, friendId) => {
    try {
        const db = getDB();
        await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { friends_request: friendId } }
        );
    } catch (error) {
        console.error('Error refusing friend request:', error);
        throw new Error('Failed to refuse friend request');
    }
};

const checkFriendStatus = async (userId, friendId) => {
    try {
        const db = getDB();
        const userDetail = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(userId) });

        if (!userDetail || !userDetail.friends) {
            return false;
        }

        const isFriend = userDetail.friends.includes(friendId);
        return isFriend;
    } catch (error) {
        console.error('Error checking friend status:', error);
        throw new Error('Failed to check friend status');
    }
};

const getListFriends = async (userId) => {
    try {
        const db = getDB();
        const userDetail = await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(userId) });
        
        if (!userDetail || !userDetail.friends || userDetail.friends.length === 0) {
            return []; 
        }

        const listFriendData = [];

        for (const friendId of userDetail.friends) {
            try {
                const friendData = await UserModel.getUserById(friendId);
                if (friendData) {
                    listFriendData.push({user_id: friendData._id, username: friendData.username}); 
                }
            } catch (error) {
                console.error(`Error fetching friend with ID ${friendId}:`, error);
            }
        }

        return listFriendData;
    } catch (error) {
        console.error('Error getting list of friends:', error);
        throw new Error('Failed to get list of friends');
    }
};

const unfriend = async (userId, friendId) => {
    try {
        const db = getDB();
        const result = await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { friends: friendId } }
        );

        if (result.modifiedCount === 1) {
            return { message: 'Unfriended successfully!' };
        } else {
            return { error: 'Failed to unfriend. User or friendId not found.' };
        }
    } catch (error) {
        console.error('Error unfriending:', error);
        throw new Error('Failed to unfriend');
    }
};


const blockFriend = async (userId, friendId) => {
    try {
        const db = getDB();
        const result = await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(userId) },
            { $addToSet: { blocklist: friendId } }
        );

        if (result.modifiedCount === 1) {
            return { message: 'Blocked successfully!' };
        } else {
            return { error: 'Failed to block. User or friendId not found.' };
        }
    } catch (error) {
        console.error('Error blocking friend:', error);
        throw new Error('Failed to block friend');
    }
};


const unblockFriend = async (userId, friendId) => {
    try {
        const db = getDB();
        const result = await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(userId) },
            { $pull: { blocklist: friendId } }
        );

        if (result.modifiedCount === 1) {
            return { message: 'Unblocked successfully!' };
        } else {
            return { error: 'Failed to unblock. User or friendId not found in blocklist.' };
        }
    } catch (error) {
        console.error('Error unblocking friend:', error);
        throw new Error('Failed to unblock friend');
    }
};


module.exports = {
    addUserDetail,
    getUserDetailByUserId,
    updateName,
    updateAge,
    updateGender,
    updateAddress,
    updateAbout,
    updateAvatar,
    sendFriendRequest,
    acceptFriendRequest,
    refuseFriendRequest,
    checkFriendStatus,
    getListFriends,
    unfriend,
    blockFriend,
    unblockFriend
};
