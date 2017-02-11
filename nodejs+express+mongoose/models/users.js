let mongoose = require('mongoose');
let crypto = require('crypto');
let Schema = mongoose.Schema;

let UserSchema = new Schema({
	username: String,
	hashed_password: String,
	salt: String,
	email: String,
	tokens: Array,
	github: String,
	profile: {}
});

UserSchema
	.virtual('password')
	.set(function (password) {
		this.salt = this.makeSalt();
		this.hashed_password = this.encryptoPassword(password);
	});

UserSchema.path('username').validate((username) => {
	return /^[a-z]{1}[a-z0-9]{0,5}$/.test(username);
}, '用户名必须是以字母开头的1到6个长度的小写字母或者数字');

UserSchema.path('hashed_password').validate((hashed_password) => {
	return /^[a-zA-Z0-9-_.]{3, 12}$/.test(password);
}, '密码必须是长度为3到12个的字母、数字、-、_、.');

UserSchema.methods = {
	makeSalt: () => {
		return Math.round(new Date().getTime() * Math.random()) + '';
	},
	encryptoPassword: function(password) {
		if(!password){
			return '';	
		}
		return crypto.createHmac('sha1', this.salt)
			.update(password)
			.digest('hex');
	},
	authenticate: function(pwd){
		return this.encryptoPassword(pwd) === this.hashed_password;
	}
};

mongoose.model('User', UserSchema);