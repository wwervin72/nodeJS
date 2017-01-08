const mongoose = require('mongoose');
// const addCreatedAt = require('../lib/mongo');
const monment = require('moment');
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

PostSchema.post('find', function (err, results, next) {
	console.log(results)
	// results.forEach(function (item, index) {
	// 	item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
	// });
	// next();
});

// PostSchema.post('findOne', function (next) {

// 	if(result){
// 			result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
// 		}
// 	results.forEach(function (item, index) {
// 		item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
// 	});
// 	next();
// });


// PostSchema.pulgin('contentToHtml', {
// 	afterFind: function (posts) {
// 	    return posts.map(function (post) {
// 		    post.content = marked(post.content);
// 		    return post;
// 	    });
// 	},
// 	afterFindOne: function (post) {
// 	    if(post){
// 	      	post.content = marked(post.content);
// 	    }
// 	    return post;
// 	}
// });

// PostSchema.pulgin(addCreatedAt);

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;