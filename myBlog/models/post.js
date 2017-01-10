const mongoose = require('mongoose');
const CommentModel = require('../controllers/comment.controller');
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
		// 查询到结果后，格式化日期，并且添加留言数
		item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
		CommentModel.getCommentsCount(item._id).then(function (count) {
			item.commentsCount = count;
			if(index === result.length - 1){
				next();
			}
		});
	});
});

PostSchema.post('findOne', function (result, next) {
	result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
	CommentModel.getCommentsCount(result._id).then(function (count) {
		result.commentsCount = count;
		next();
	});
});

// 查找之前执行
PostSchema.pre('find', function (next) {
	next();
})

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;