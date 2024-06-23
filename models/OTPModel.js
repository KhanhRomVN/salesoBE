const { getDB } = require('../config/mongoDB');
const { ObjectId } = require('mongodb');

const OTP_COLLECTION = 'otps';

const storeOTP = async (email, otp) => {
    try {
        const db = getDB();
        await db.collection(OTP_COLLECTION).insertOne({ email, otp, createdAt: new Date() });
    } catch (error) {
        console.error('Error in storeOTP:', error);
        throw error;
    }
};

const verifyOTP = async (email, otp) => {
    try {
        const db = getDB();
        const otpRecord = await db.collection(OTP_COLLECTION).findOne({ email, otp });
        if (!otpRecord) {
            return false;
        }

        await db.collection(OTP_COLLECTION).deleteOne({ _id: new ObjectId(otpRecord._id) });
        await db.collection('users').insertOne({ email, emailConfirmed: 'true'});
        
        return true;
    } catch (error) {
        console.error('Error in verifyOTP:', error);
        throw error;
    }
};

module.exports = {
    storeOTP,
    verifyOTP,
};
