var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	uname: {
		type: String
	},
	password: {
		type: String
	},
	sex: {
		type: String
	},
	phone: Number,
	address: String,
	cardNum: {
		type: Number,
		unique: true
	},
	email: {
		type: String,
		unique: true
	},
	createDate: {
		type: Date,
		default: new Date()
	},
	updateDate: {
		type: Date,
		default: new Date()
	}
});

var User = mongoose.model('User', userSchema);

module.exports = User;