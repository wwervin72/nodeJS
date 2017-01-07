const express = require('express');
const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin;
const UserModel = require('../controllers/users.controller');

// GET /signout 登出
router.get('/', checkLogin, function(req, res, next) {
	UserModel.signout(req, res, next);
});

module.exports = router;