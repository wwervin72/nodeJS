let mongoose = require('mongoose');
let User = mongoose.model('User');
let githubStrategy = require('passport-github').Strategy;
let config = require('config-lite');

module.exports = new githubStrategy({
	clientID: config.github.clientID,
	clientSecret: config.github.clientSecret,
	callbackURL: config.github.callbackURL
}, (accessToken, refreshToken, profile, done) => {
	User.findOne({github: profile.id}, (err, userId) => {
		if(err){
			return done(err);
		}
		if(userId){
			return done(null, userId);
		}
		User.findOne({email: profile._json.email}, (err, userEmail) => {
			if(err){
				return done(err);
			}
			if(userEmail){
				return done(null, false, {message: 'you count email has been used'});
			}else{
				let user = new User();
				user.email = profile._json.email;
		        user.github = profile.id;
		        user.tokens.push({ kind: 'github', accessToken });
		        user.profile.name = profile.displayName;
		        user.profile.picture = profile._json.avatar_url;
		        user.profile.location = profile._json.location;
		        user.profile.website = profile._json.blog;	
		        user.save((err) => {
		        	done(err, user);
		        });				
			}
		});
	});
});