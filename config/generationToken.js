const jwt = require('jsonwebtoken');

function generateEmailToken(userId) {
    const payload = { userId };
    const options = { expiresIn: '1d' };
    const emailToken = jwt.sign(payload, process.env.EMAIL_SECRET_KEY, options);
    const urlSafeToken = emailToken.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    return urlSafeToken;
}

module.exports = {
    generateEmailToken
}
