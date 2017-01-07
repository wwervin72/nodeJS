module.exports = {
	port: 3000,
	session: {
		secret: 'myBlog',
		key: 'myBlog',
		maxAge: 1800000
	},
	mongodb: 'mongodb://localhost:8080/myBlog'
}