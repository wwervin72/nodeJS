const mongoose = require('mongoose');
const addCreatedAt = require('../lib/mongo');

const UserSchema = new mongoose.Schema({
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

UserSchema.plugin(addCreatedAt);

const User = mongoose.model('User', UserSchema);

module.exports = User;