let mongoose = require('mongoose');
let localStrategy = require('passport-local').Strategy;
let User = mongoose.model('User');

module.exports = new localStrategy({
	usernameField: 'username',
	passwordField: 'password'
}, (username, password, done) => {
	User.findOne({username: username}, (err, user) => {
		if(err){
			return done(err);
		}
		if(!user){
			return done(null, false, {message: '用户名不存在'});
		}
		if(user.authenticate(password)){
			return done(null, user, {message: '登陆成功'});
		}else{
			return done(null, false, {message: '用户名或者密码不正确'});
		}
	})
})