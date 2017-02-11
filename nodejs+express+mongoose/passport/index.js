let mongoose = require('mongoose');
let User = mongoose.model('User');
let local = require('./local');
let github = require('./github');

module.exports = (passport) => {
	
	passport.serializeUser((user, done) => done(null, user.id));

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});

	passport.use(local);
	passport.use(github);
}