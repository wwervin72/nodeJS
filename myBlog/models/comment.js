const mongoose = require('mongoose');

const commontSchema = mongoose.Schema({
	author: {
		type: mongoose.Types.ObjectId,
		ref: 'User'
	},
	content: {
		type: 'string'
	},
	postId: {
		type: mongoose.Types.ObjectId
		ref: 'Post'
	}
});

const Commont = mongoose.model('Commont', commontSchema);

mondule.exports = Commont;