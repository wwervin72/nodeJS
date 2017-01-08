const monment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

// 根据id生成创建时间 created_at
module.exports = function (schema, options) {
	schema.statics.afterFind = function (results) {
		results.forEach(function (item, index) {
			item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
		});
		return results;
	};
	schema.statics.afterFindOne = function (result) {
		if(result){
			result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
		}
		return result;
	};
};