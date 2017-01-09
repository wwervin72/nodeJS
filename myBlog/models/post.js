const mongoose = require('mongoose');
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

const PostSchema = new mongoose.Schema({
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

PostSchema.post('find', function (result, next) {
	result.forEach(function (item, index) {
		item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
	});
	next();
});

PostSchema.post('findOne', function (result, next) {
	result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
	next();
});

// 查找之前执行
PostSchema.pre('find', function (next) {
	next();
})

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;