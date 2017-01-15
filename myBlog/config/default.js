module.exports = {
	port: 3000,
	session: {
		secret: 'blog',
		key: 'blog',
		maxAge: 1800000
	},
	mongodb: 'mongodb://localhost:8080/myBlog'
}