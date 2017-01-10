const mongoose = require('mongoose');
const marked = require('marked');

const commontSchema = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	content: {
		type: 'string'
	},
	postId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Post'
	}
});

commontSchema.post('find', function (result, next) {
	result.forEach(function (item) {
		item.content = marked(item.content);
	}); 
	next();
});

const Commont = mongoose.model('Commont', commontSchema);

module.exports = Commont;