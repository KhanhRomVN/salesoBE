const { getDB } = require('../config/mongoDB');
const Joi = require('joi');
const UserModel = require('./UserModel');

const COLLECTION_NAME = 'user_detail';
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

//* Just For When Register
const addUserDetail = async (userDetailData) => {
    try {
        const db = getDB();
        return await db.collection(COLLECTION_NAME).insertOne(userDetailData);
    } catch (error) {
        console.error('Error adding user detail:', error);
        throw new Error('Failed to add user detail');
    }
};

//* Get Detail User
const getUserDetailByUserId = async (userId) => {
    try {
        const db = getDB();
        return await db.collection(COLLECTION_NAME).findOne({ user_id: userId });
    } catch (error) {
        console.error('Error getting user detail:', error);
        throw new Error('Failed to get user detail');
    }
};

//* Update User Detail Data
const updateUserDetailField = async (user_id, updateData) => {
    const db = getDB();
    
    try {
        db.collection(COLLECTION_NAME).updateOne({ user_id }, { $set: updateData, $currentDate: { update_at: true } })
    } catch (error) {
        
    }
}

//* Friend User
const sendFriendRequest = async (user_id, friend_id) => {
    try {
        const db = getDB();
        const userDetail = await db.collection(COLLECTION_NAME).findOne({ user_id: friend_id });

        if (!userDetail) {
            throw new Error('User not found');
        }

        if (!userDetail.friends_request) {
            userDetail.friends_request = [];
        }

        if (userDetail.friends_request.includes(friend_id)) {
            throw new Error('Friend request already sent');
        }

        await db.collection(COLLECTION_NAME).updateOne(
            { user_id: friend_id },
            { $addToSet: { friends_request: user_id } }
        );

        return { message: 'Friend request sent successfully!' };
    } catch (error) {
        console.error('Error sending friend request:', error);
        throw new Error('Failed to send friend request');
    }
};

const acceptFriendRequest = async (user_id, friend_id) => {
    try {
        const db = getDB();
        const userDetail = await db.collection(COLLECTION_NAME).findOne({ user_id: user_id });

        if (!userDetail) {
            throw new Error('User not found');
        }

        const index = userDetail.friends_request.indexOf(friend_id);
        if (index === -1) {
            throw new Error('Friend request not found');
        }

        userDetail.friends_request.splice(index, 1);
        userDetail.friends = userDetail.friends || [];
        userDetail.friends.push(friend_id);

        await db.collection(COLLECTION_NAME).updateOne(
            { user_id: user_id },
            { $set: { friends_request: userDetail.friends_request, friends: userDetail.friends } }
        );

        // Update friend's list as well
        const friendDetail = await db.collection(COLLECTION_NAME).findOne({ user_id: friend_id });
        if (friendDetail) {
            friendDetail.friends = friendDetail.friends || [];
            friendDetail.friends.push(user_id);
            await db.collection(COLLECTION_NAME).updateOne(
                { user_id: friend_id },
                { $set: { friends: friendDetail.friends } }
            );
        }

        return { message: 'Friend request accepted successfully!' };
    } catch (error) {
        console.error('Error accepting friend request:', error);
        throw new Error('Failed to accept friend request');
    }
};

const rejectFriendRequest = async (user_id, friend_id) => {
    try {
        const db = getDB();
        const userDetail = await db.collection(COLLECTION_NAME).findOne({ user_id: user_id });

        if (!userDetail) {
            throw new Error('User not found');
        }

        const index = userDetail.friends_request.indexOf(friend_id);
        if (index === -1) {
            throw new Error('Friend request not found');
        }

        userDetail.friends_request.splice(index, 1);

        await db.collection(COLLECTION_NAME).updateOne(
            { user_id: user_id },
            { $set: { friends_request: userDetail.friends_request } }
        );

        return { message: 'Friend request rejected successfully!' };
    } catch (error) {
        console.error('Error rejecting friend request:', error);
        throw new Error('Failed to reject friend request');
    }
};

const getListFriendRequest = async (user_id) => {
    try {
        const db = getDB();
        const userDetail = await db.collection(COLLECTION_NAME).findOne({ user_id: user_id });

        if (!userDetail) {
            throw new Error('User not found');
        }

        const friendRequests = userDetail.friends_request || [];
        const friendRequestDetails = [];

        for (const friend_id of friendRequests) {
            const friendData = await UserModel.getUserById(friend_id);
            if (friendData) {
                friendRequestDetails.push({
                    user_id: friendData._id,
                    username: friendData.username,
                });
            }
        }

        return friendRequestDetails;
    } catch (error) {
        console.error('Error getting list of friend requests:', error);
        throw new Error('Failed to get list of friend requests');
    }
};

const checkFriendStatus = async (user_id, friend_id) => {
    const db = getDB();
    try {
        const userDetail = await db.collection(COLLECTION_NAME).findOne({ user_id: user_id });
        if (!userDetail) {
            throw new Error('User not found');
        }

        const isFriend = userDetail.friends.includes(friend_id);
        const isBlocked = userDetail.blocklist.includes(friend_id);
        const hasSentRequest = userDetail.friends_request.includes(friend_id);

        return {
            isFriend,
            isBlocked,
            hasSentRequest,
        };
    } catch (error) {
        console.error('Error checking friend status:', error);
        throw new Error('Failed to check friend status');
    }
};

const getListFriend = async (user_id) => {
    try {
        const db = getDB();
        const userDetail = await db.collection(COLLECTION_NAME).findOne({ user_id: user_id });
        if (!userDetail) { 
            throw new Error('User not found');
        }

        const friends = userDetail.friends || [];
        const friendDetails = [];

        for (const friend_id of friends) {
            const friendData = await UserModel.getUserById(friend_id);
            if (friendData) {
                friendDetails.push({
                    user_id: friendData._id.toString(),
                    username: friendData.username,
                });
            }
        }

        return friendDetails;
    } catch (error) {
        console.error('Error getting friend list:', error);
        throw new Error('Failed to get friend list');
    }
};

const blockFriend = async (user_id, friend_id) => {
    const db = getDB();
    try {
        const userDetail = await db.collection(COLLECTION_NAME).findOne({ user_id: user_id });
        if (!userDetail || !userDetail.friends.includes(friend_id)) {
            throw new Error('Cannot block user who is not a friend');
        }

        await db.collection(COLLECTION_NAME).updateOne(
            { user_id: user_id },
            { $addToSet: { blocklist: friend_id }, $pull: { friends: friend_id } }
        );

        return { message: 'Blocked successfully!' };
    } catch (error) {
        console.error('Error blocking friend:', error);
        throw new Error('Failed to block friend');
    }
};

const unblockFriend = async (user_id, friend_id) => {
    const db = getDB();
    try {
        await db.collection(COLLECTION_NAME).updateOne(
            { user_id: user_id },
            { $pull: { blocklist: friend_id }, $addToSet: { friends: friend_id } }
        );

        return { message: 'Unblocked successfully!' };
    } catch (error) {
        console.error('Error unblocking friend:', error);
        throw new Error('Failed to unblock friend');
    }
};

const getListBlockFriend = async (user_id) => {
    const db = getDB();
    try {
        const userDetail = await db.collection(COLLECTION_NAME).findOne({ user_id: user_id });
        if (!userDetail) {
            throw new Error('User not found');
        }

        const blockedFriends = userDetail.blocklist || [];
        const blockedFriendDetails = [];

        for (const blocked_id of blockedFriends) {
            const blockedData = await UserModel.getUserById(blocked_id);
            if (blockedData) {
                blockedFriendDetails.push({
                    user_id: blockedData._id.toString(),
                    username: blockedData.username,
                });
            }
        }

        return blockedFriendDetails;
    } catch (error) {
        console.error('Error getting blocked friend list:', error);
        throw new Error('Failed to get blocked friend list');
    }
};

module.exports = {
    addUserDetail,
    getUserDetailByUserId,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getListFriendRequest,
    updateUserDetailField,
    checkFriendStatus,
    getListFriend,
    getListBlockFriend,
    blockFriend,
    unblockFriend,
};
