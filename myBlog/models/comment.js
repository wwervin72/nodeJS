const mongoose = require('mongoose');

const commontSchema = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	content: {
		type: 'string'
	},
	postId: {
		type: mongoose.Schema.Types.ObjectId
		ref: 'Post'
	}
});

const Commont = mongoose.model('Commont', commontSchema);

mondule.exports = Commont;