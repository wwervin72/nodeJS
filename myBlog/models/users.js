const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	name: {
		type: 'string'
	},
	password: {
		type: 'string'
	},
	avatar: {
		type: 'string'
	},
	gender: {
		type: 'string', 
		enum: ['m', 'f', 'x']
	},
	bio: {
		type: 'string'
	}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;