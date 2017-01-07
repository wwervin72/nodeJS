const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	title: {
		type: String 
	},
	content: {
		type: String
	},
	pv: {
		type: Number
	}
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;