var express = require('express'),
	path = require('path');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));

// 设置跨域
// app.use(function (req, res, next) {
// 	res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
// 	next();
// });

app.set('views', path.join(__dirname, './public/views/'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
	res.render('home');
});

app.get('/about', function (req, res) {
	res.render('about');
});

app.get('/login', function (req, res) {
	res.render('login');
});

// 定制404页面
app.use(function (req, res) {
	res.status(404);
	res.render('404')
});

//定制500页面
app.use(function (err, req, res, next) {
	res.status(500);
	res.render('500');
})

app.listen(app.get('port'), function () {
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
