let mongoose = require('mongoose');
let User = mongoose.model('User');
let passport = require('passport');

module.exports = {
	login: (req, res, next) => {
		passport.authenticate('local', (err, user, info) => {
			if(err){
				return next(err);
			}
			if(!user){
				return res.redirect('/signin');
			}
			req.logIn(user, (err) => {
				if(err){
					return next(err);
				}
				res.redirect('/');
			});
		})(req, res, next);
	},
	register: (req, res, next) => {
		let user = new User(req.body);
		user.save((err, user) => {
			if(err) {
				return next(err);
			}
			res.redirect('/');
		})
	}
};