module.exports = function (app) {
	app.use('/signup', require('./signup'));
	app.use('/signin', require('./signin'));
	app.use('/signout', require('./signout'));
	app.use('/', require('./posts'));
	// 404页面
	app.use(function (req, res) {
		if(!res.headersSent){
			res.render('404');
		}
	});
};