const express = require('express');
const router = express.Router();
const path = require('path');
const sha1 = require('sha1');


const UserModel = require('../controllers/users.controller');
const checkNotLogin = require('../middlewares/check').checkNotLogin;


// GET /signup 注册页
router.get('/', checkNotLogin, function(req, res, next) {
  	res.render('signup');
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function(req, res, next) {
	UserModel.register(req, res, next);
});


module.exports = router;