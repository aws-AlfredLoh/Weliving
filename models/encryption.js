const crypto = require('crypto');

module.exports = function getRePassword(password){
    let hashPassword = crypto.createHash('sha1');
    hashPassword.update(password);
    const rePassword = hashPassword.digest('hex');
    console.log(hashPassword);
    console.log(rePassword);
    return rePassword
}