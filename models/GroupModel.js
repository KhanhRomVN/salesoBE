const { getDB } = require('../config/mongoDB');
const Joi = require('joi');

const COLLECTION_NAME = 'groups';
const COLLECTION_SCHEMA = Joi.object({
    // name (tên group)
    // about (tóm tắt sơ qua)
    // admins (1 mảng chứa các id user)
    // mods (1 mảng chứa các id user)
    // members (1 mảng chứa các id user)
    // posts (1 mảng chứa các id của post)
    // create_at
    // is_active (nhóm có hoạt đông ko?)
    // update_at (lần cuối cập nhật các thông tin group)
    // status (có 3 trạng thái cơ bản là public(là có thể join mà ko cần lời chấp nhận từ admin, mod) private)
}).options({ abortEarly: false });
const validateUser = (userData) => {
    const validation = COLLECTION_SCHEMA.validate(userData);
    if (validation.error) {
        throw new Error(validation.error.details.map(detail => detail.message).join(', '));
    }
};


module.exports = {

};
