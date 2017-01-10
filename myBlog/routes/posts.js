const express = require('express');
const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin;
const PostModel = require('../controllers/post.controller');
const UserModel = require('../controllers/users.controller');
const CommentModel = require('../controllers/comment.controller');


//GET / 所有用户的文章
router.get('/', function (req, res, next){
	// 获取所有用户的所有文章
	PostModel.getAllPosts().then(function (result) {
		res.render('posts', {
			posts: result
		});
	});
});

//GET  特定用户的文章页
//eg: GET /:author
router.get('/:author',  function (req, res, next) {
	let author = req.params.author;
	// 获取特定用户的文章
	PostModel.getPosts(author)
		.then(function (result) {
			res.render('posts', {
				posts: result
			});
		});;
});

//GET /:author/create发表文章页
router.get('/:author/create', checkLogin, function (req, res, next) {
	res.render('create');
});

//POST /:author/create发表一篇文章
router.post('/:author/create', checkLogin, function (req, res, next) {
	PostModel.create(req, res, next);
});


//GET /:author/:postId单独一篇的文章页
router.get('/:author/:postId', function(req, res, next) {
	let author = req.params.author;
	let postId = req.params.postId;

	Promise.all([
		PostModel.getPostById(postId),
		CommentModel.getComments(postId),
		PostModel.incPv(postId)
	]).then(function (result) {
		let post = result[0];
		let comments = result[1];
		if(!post){
			// 文章不存在
			res.render('404');
		}
		res.render('post', {
			post: post,
			comments: comments
		});
	});

});


//GET /posts/:postId/edit更新文章页
router.get('/:author/:postId/edit', checkLogin, function (req, res, next) {
	let author = req.params.author;
	let postId = req.params.postId;
	let user = req.session.user._id;

	if(user.toString() !== author.toString()){
		throw new Error('权限不足');
	}

	PostModel.getRawPostById(author, postId)
		.then(function (result) {
			if(!result){
				throw new Error('该文章不存在');
			}
			res.render('edit', {
				post: result
			});
		});
});

// POST /posts/:postId/edit 更新一篇文章
router.post('/:author/:postId/edit', checkLogin, function(req, res, next) {
  	let author = req.params.author;
	let postId = req.params.postId;
	let title = req.fields.title;
	let content = req.fields.content;
	let data = {
		title: title,
		content: content
	};

	PostModel.updatePostById(author, postId, data)
		.then(function (result) {
			req.flash('success', '编辑文章成功');
			res.redirect('/' + author + '/' + postId);
		});
});

// GET /posts/:postId/remove 删除一篇文章
router.get('/:author/:postId/remove', checkLogin, function(req, res, next) {
	let author = req.params.author;
	let postId = req.params.postId;
	let user = req.session.user._id;

	if(user.toString() !== author.toString()){
		throw new Error('权限不足');
	}

	PostModel.getRawPostById(author, postId)
		.then(function (result) {
			if(!result){
				throw new Error('文章不存在');
			}

			Promise.all([
				PostModel.removePostById(author, postId),
				CommentModel.delCommentsByPostId(postId)
			]).then(function (result) {
				res.redirect('/' + author)
			});
			// PostModel.removePostById(author, postId)
			// 	.then(function (result) {
			// 		res.redirect('/'+author)
			// 	});
		});
});

// POST /posts/:postId/comment 创建一条留言
router.post('/:author/:postId/comment', checkLogin, function(req, res, next) {
	CommentModel.create(req, res, next);
});

// GET /posts/:postId/comment/:commentId/remove 删除一条留言
router.get('/:author/:postId/comment/:commentId/remove', checkLogin, function(req, res, next) {
	let commentId = req.params.commentId;
	let author = req.session.user._id;

	CommentModel.delCommentById(commentId, author)
		.then(function () {
			req.flash('success', '删除留言成功');
		    // 删除成功后跳转到上一页
		    res.redirect('back');
		});
});

module.exports = router;