const db = require('../config/development_config');

module.exports = function customerEdit(id, memberUpdatedate){
    let result = {};
    return new Promise((resolve, reject) => {
        db.query('UPDATE member_info SET ? WHERE id = ?',[memberUpdatedate, id], function(err, rows){
            if(err){
                console.log(err);
                result.status = "會員資料更新失敗。"
                result.err = "伺服器錯誤，請稍後在試！"
                reject(result);
                return;
            }else{
                result.status = "會員資料更新成功。"
                result.memberUpdateData = memberUpdateData
                resolve(result)
            }
        })
    })
}