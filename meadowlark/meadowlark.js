var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	jqupload = require('jquery-file-upload-middleware'),
	fortune = require('./app/models/fortune');

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

// 路由
app.get('/', function (req, res) {
	res.render('home');
});

app.get('/about', function (req, res) {
	res.render('about', {fortune: fortune.getFortune()});
});

app.get('/login', function (req, res) {
	res.render('login');
});

app.get('/register', function (req, res) {
	res.render('register', {csrf: 'CSRF token goes here'});
});

app.use(bodyParser());

app.post('/process', function (req, res) {
	res.json({
		result: true,
		info: req.body
	});
});

app.get('/uploadfile', function (req, res) {
	res.render('uploadFile');
});

app.use('/upload', function (req, res, next) {
	var now = Date.now();
	jqupload.fileHandler({
		uploadDir: function () {
			return path.join(__dirname, '/public/uploads/' + now);
		},
		uploadUrl: function () {
			return path.join('/uploads/', String(now));
		}
	})(req, res, next);
});

app.get('/header', function (req, res) {+

	res.set('text/plain');
	var s = '';
	for(var name in req.headers){
		s += name + ': ' + req.headers[name] + '<br/>';
	}
	res.send(s);
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
