const Post = require('../models/post');

module.exports = {
	create: function create (req, res, next) {
		let author = req.session.user._id;
		let title = req.fields.title;
		let content = req.fields.content;
		let post = new Post({
			author: author,
		    title: title,
		    content: content,
		    pv: 0
		});
		try{
			if(!title.length) {
		      throw new Error('请填写标题');
		    }else if(!content.length) {
		      throw new Error('请填写内容');
		    }
		}catch(e) {
			req.flash('error', e.message);
			return res.redirect('back');
		}
		post.save(function (err, row) {
			if(err){
				return next();
			}
			req.flash('success', '发表成功');
			// 发表成功后跳转到该文章页
      		res.redirect('/' + row.author + '/' + row._id);
		});
	},
	getAllPosts: function getAllPosts() {
		return Post.find({})
			.populate({path: 'author', model: 'User'})
			.sort({_id: -1});
	},
	// 通过文章id查找文章
	getPostById: function getPostById (postId) {
		return Post.findOne({_id: postId})
			.populate({path: 'author', model: 'User'})
			.sort({_id: -1});
	},
	getPosts: function getPosts (author) {
		let query = {};
		if(author){
			query.author = author;
		}
		return Post
			.find(query)
			.populate({path: 'author', model: 'User'})
			.sort({_id: -1});
	},
	incPv: function incPv (postId) {
		return Post.update({_id: postId}, {$inc: {pv: 1}});
	},
	// 通过作者、文章id查找文章
	getRawPostById: function getRawPostById (author, postId) {
		return Post
		    .findOne({author: author, _id: postId})
		    .populate({path: 'author', model: 'User'});
	},
	updatePostById: function updatePostById(author, postId, data) {
	  	return Post
	  		.update({author: author, _id: postId}, {$set: data});
	},
	removePostById: function removePostById(author, postId) {
		return Post
			.remove({author: author, _id: postId});
	}
};