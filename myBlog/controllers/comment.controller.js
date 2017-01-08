const Comment = require('../models/comment');

module.exports = {
	// 创建一个留言
	create: function create(comment) {
		return Comment.create(comment).exec();
	},
	// 通过留言ID和作者ID删除一个留言
	delCommentById: function delCommentById(commentId, author) {
		return Comment.remove({author: author, _id: commentId}).exec();
	},
	// 根据文章ID删除该文章下所有留言
	delCommentsByPostId: function delCommentsByPostId (postId) {
		return Comment.remove({postId: postId}).exec();
	},
	// 通过文章ID获取该文章下所有留言，按留言创建时间升序
	getComments: function getComments (postId) {
		return Comment
			.find({postId: postId})
			.populate({path: 'author', model: 'User'})
			.sort({_id: -1})
			.exec();
	},
	// 根据文章获取改文章下留言数
	getCommentsCount: function getCommentsCount (postId) {
		return Comment.count({postId: postId}).exec();
	}
};