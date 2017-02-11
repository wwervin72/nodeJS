module.exports = (app, passport) => {
	app.use('/signup', require('./signUp'));
	app.use('/signin', require('./signIn'));
	app.use('/signout', require('./signOut'));
	app.use('/', require('./home'));
	app.get('/auth/github', passport.authenticate('github'));
	app.get('/auth/github/callback', passport.authenticate('github', {
			failureRedirect: '/signin'
		}), (req, res) => {
	  		res.redirect(req.session.returnTo || '/');
	});
}