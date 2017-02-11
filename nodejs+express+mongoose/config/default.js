module.exports = {
	mongoDB: 'mongodb://localhost:8080/myBlog',
	port: 3000,
	session: {
		key: 'myBlog',
		secret: 'myblog',
		maxAge: 30 * 60 * 1000,
		url: 'mongodb://localhost:8080/myBlog'
	},
	github: {
		clientID: 'cb448b1d4f0c743a1e36',
		clientSecret: '815aa4606f476444691c5f1c16b9c70da6714dc6',
		callbackURL: 'http://localhost:3000/auth/github/callback'
	}
};