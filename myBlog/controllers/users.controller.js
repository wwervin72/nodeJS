const Users = require('../models/users');
const sha1 = require('sha1');
const path = require('path');

module.exports = {
	// 注册用户
	register: function register (req, res, next) {
		let name = req.fields.name;
	  	let gender = req.fields.gender;
	  	let bio = req.fields.bio;
	  	let avatar = req.files.avatar.path.split(path.sep).pop();
	  	let password = sha1(req.fields.password);
	  	Users.findOne({name: name}, function (err, user) {
	  		if(err){
				return next();
			}
			if(!user){
				let userInfo = new Users({
					name: name,
					gender: gender,
					bio: bio,
					avatar: avatar,
					password: password
				});
				userInfo.save(function (err, result) {
					if(err){
						return next();
					}
					// 此 user 是插入 mongodb 后的值，包含 _id
				    // 将用户信息存入 session
				    delete result.password;
				    req.session.user = result;
				    // 写入 flash
				    req.flash('success', '注册成功');
				    // 跳转到首页
				    res.redirect('/');
				})
			}else{
				req.flash('error', '该用户名已被占用');
				res.redirect('/signup');
			}
	  	});
	},
	// 登出
	signout: function signout(req, res, next) {
		delete req.session.user;
		req.flash('success', '退出成功');
		res.redirect('/')
	},
	// 登陆
	signin: function signin (req, res, next) {
		let name = req.fields.name;
		let password = req.fields.password;
		Users.findOne({name: name}, function (err, row) {
			if(!row){
				req.flash('error', '用户不存在');
	        	return res.redirect('back');
			}
			if(sha1(password) !== row.password){
				req.flash('error', '用户名或密码错误');
	        	return res.redirect('back');
			}
			req.flash('success', '登录成功');
		    // 用户信息写入 session
		    delete row.password;
		    req.session.user = row;
		    // 跳转到主页
		    res.redirect('/' + row._id);
		});
	},
	// 根据用户名获取用户信息
	getUserByName: function getUserByName (name) {
		return Users
			.findOne({name: name})
			.addCreatedAt()
			.exec();
	}
};