const toRegister = require('../models/register_model');
const loginAction = require('../models/login_model');
const Check = require('../sevice/member_check'); // class
const encryption = require('../models/encryption');
const jwt = require('jsonwebtoken');
const config = require('../config/development_config');

check = new Check();

module.exports = class Member {

    postRegister(req, res, next) {
        // 獲取client端資料
        const password = encryption(req.body.password);

        const memberData = {
            name: req.body.name,
            email: req.body.email,
            password: password,
            phone: req.body.phone,
            create_date: onTime()
        }
        // 將資料寫入資料庫

        const checkEmail = check.checkEmail(memberData.email);
        
        if(checkEmail == true){
            toRegister(memberData).then(result => {
                // 若寫入成功則回傳
                res.json({
                    result: result 
                })
            }, (err) => {
                // 若寫入失敗則回傳
                res.json({
                    result: err
                })
            })
        }else{
            res.json({
                result:{
                    status:"註冊失敗。",
                    result:"請輸入正確的Eamil格式"   
                }
            })
        }      
    }

    postLogin(req, res, next){

        const password = encryption(req.body.password);

        const memberData = {
            email: req.body.email,
            password: password,
        }

        loginAction(memberData).then(rows => {
            if(check.checkNull(rows) === true){
                res.json({
                    result:{
                        status: "登入失敗。",
                        err: "請輸入正確的帳號或密碼。"
                    }
                    
                })
            }else if(check.checkNull(rows) === false){

                const token = jwt.sign({algorithm:'HS256', exp:Math.floor(Date.now() / 1000)+ (60 * 60), data: rows[0].id}, config.secret);
                res.setHeader('token',token);
                res.json({
                    result:{
                        status: "登入成功。",
                        loginMember: "歡迎 " + rows[0].name + " 的登入！"
                    }
                })
            }
        })   
    }

    postUpdate(req, res, next){
        const token = req.header['token'];
        if(check.checkNull(token) == true){
            res.json({
                err:"請輸入token！"
            })
        }else if(check.checkNull(token) == false){
            verify(token).then(tokenResult => {
                if(tokenResult == false){
                    res.json({
                        result:{
                            status:"token錯誤。",
                            err: "請重新登入。"
                        }
                    })
                }else{
                    const id = tokenResult;
                    const password = encryption(req.body.password);
                    const memberUpdateData = {
                        name: req.body.name,
                        password: password,
                        update_date: onTime()
                    }
                    updateAction(id, memberUpdateData).then(result => {
                        res.json({
                            result: result
                        })
                    },(err) => {
                        res.json({
                            result: err
                        })
                    })

                }
            })
        }
    }

    

    
}





//取得現在時間，並將格式轉成YYYY-MM-DD HH:MM:SS
const onTime = () => {
    const date = new Date();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    const hh = date.getHours();
    const mi = date.getMinutes();
    const ss = date.getSeconds();

    return [date.getFullYear(), "-" +
        (mm > 9 ? '' : '0') + mm, "-" +
        (dd > 9 ? '' : '0') + dd, " " +
        (hh > 9 ? '' : '0') + hh, ":" +
        (mi > 9 ? '' : '0') + mi, ":" +
        (ss > 9 ? '' : '0') + ss
    ].join('');
}