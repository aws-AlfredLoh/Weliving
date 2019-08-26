var express = require('express');
var router = express.Router();

const MemberModifyMethod = require('../controllers/modify_controller');
//class of MemberModifyMethod

memberModifyMethod = new MemberModifyMethod();

router.post('/api/register', memberModifyMethod.postRegister);

router.post('/api/login', memberModifyMethod.postLogin);

router.put('/update', memberModifyMethod.putUpdate);

module.exports = router;
