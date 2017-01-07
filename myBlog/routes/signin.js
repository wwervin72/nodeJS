const express = require('express');
const router = express.Router();
const sha1 = require('sha1');
const UserModel = require('../controllers/users.controller');
const checkLogin = require('../middlewares/check').checkLogin;
const checkNotLogin = require('../middlewares/check').checkNotLogin;

//GET /signin登陆页
router.get('/', function (req, res, next) {
	res.render('signin');
});	

//POST /signin用户登陆
router.post('/', function (req, res, next) {
	UserModel.signin(req, res, next);
});

module.exports = router;