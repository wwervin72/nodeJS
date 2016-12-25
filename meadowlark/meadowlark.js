var express = require('express'),
	path = require('path'),
	fs = require('fs'),
	bodyParser = require('body-parser'),
	jqupload = require('jquery-file-upload-middleware'),
	credential = require('./credentials'),
	connect = require('connect'),
	emailService = require('./app/lib/email.js')(credential),
	Vacation = require('./app/models/vacation'),
	fortune = require('./app/models/fortune');

var app = express();
var dataDir = path.join(__dirname, '/data');
var vacationPhotoDir = path.join(dataDir, '/vacationPhoto');
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existsSync(vacationPhotoDir) || fs.mkdirSync(vacationPhotoDir);

var mongoose = require('mongoose');
var opts = {
	server: {
		socketOptions: {
			keepAlive: 1
		}
	}
};

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));

switch (app.get('env')) {
	case 'dev':
		mongoose.connect('mongodb://' + credential.mongo.dev.connectionString, opts);
		break;
	case 'pro':
		mongoose.connect('mongodb://' + credential.mongo.pro.connectionString, opts);
		break;
	default:
		mongoose.connect('mongodb://' + credential.mongo.dev.connectionString, opts);
		break;
}

Vacation.find(function(err, vacations){
	if(vacations.length){
		return;
	}
	new Vacation({
		name: 'Hood River Day Trip',
		slug: 'hood-river-day-trip',
		category: 'Day Trip',
		sku: 'HR199',
		description: 'Spend a day sailing on the Columbia and ' +
		'enjoying craft beers in Hood River!',
		priceInCents: 9995,
		tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
		inSeason: true,
		maximumGuests: 16,
		available: true,
		packagesSold: 0
	}).save();
	new Vacation({
		name: 'Oregon Coast Getaway',
		slug: 'oregon-coast-getaway',
		category: 'Weekend Getaway',
		sku: 'OC39',
		description: 'Enjoy the ocean air and quaint coastal towns!',
		priceInCents: 269995,
		tags: ['weekend getaway', 'oregon coast', 'beachcombing'],
		inSeason: false,
		maximumGuests: 8,
		available: true,
		packagesSold: 0
	}).save();
	new Vacation({
		name: 'Rock Climbing in Bend',
		slug: 'rock-climbing-in-bend',
		category: 'Adventure',
		sku: 'B99',
		description: 'Experience the thrill of climbing in the high desert.',
		priceInCents: 289995,
		tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing'],
		inSeason: true,
		requiresWaiver: true,
		maximumGuests: 4,
		available: false,
		packagesSold: 0,
		notes: 'The tour guide is currently recovering from a skiing accident.'
	}).save();
});

// 设置跨域
// app.use(function (req, res, next) {
// 	res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
// 	next();
// });

app.set('views', path.join(__dirname, './public/views/'));
app.set('view engine', 'ejs');

app.use(bodyParser());
app.use(require('cookie-parser')(credential.cookieSecret));
// app.use(require('express-session')());

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

app.post('/login', function (req, res) {
	res.cookie('meadowlark_username', req.body.uname, {signed: true, maxAge: 1800000});
	res.json({
		result: true,
		info: '登陆成功'
	});
});

app.get('/vacations', function (req, res) {
	Vacation.find({available: true}, function (err, rows) {
		if(err){
			console.log(err);
		}
		var context = {
			vacations: rows.map(function(row){
				return {
					sku: row.sku,
					name: row.name,
					description: row.description,
					price: row.getDisplayPrice(),
					inSeason: row.inSeason,
				}
			})
		};
		res.render('vacations', context);
	})
});

app.get('/register', function (req, res) {
	res.render('register', {csrf: 'CSRF token goes here'});
});

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

app.post('/cart/checkout', function (req, res) {
	var cart = req.session.cart;
	if(!cart){
		next(new Error('Cart is not exist'));
	}
	var name = req.body.name || '', email = req.body.email || '';
	// 输入验证码
	if(!email.match(VALID_EMAIL_REGEX)){
		return res.next(new Error('Invalid email address'));
	}
	// 分配一个随机的购物车ID，一般我们会用一个数据库ID
	cart.number = Math.random().toString().replace(/^0\.0*/, '');
	cart.billing = {
		name: name,
		email: email
	};
	res.render('cart-tks', {
		layout: null,
		cart: cart
	}, function (err, html) {
		if(err){
			console.log('error in email template');
		}
		emailService.send({
			from: '"Meadowlark Travel": info@meadowlarktravel.com',
			to: cart.billing.email,
			subject: 'Thank you for Book your Trip with Meadowlark',
			html: html,
			generateTextFromHtml: true
		}, function (err) {
			if(err){
				console.log('uable to send confirmation: ' + err.stack);
			}
		});
	});
});

app.post('/contest/vacation-photo/:year/:month', function(req, res){
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
		if(err){
			return res.redirect(303, '500');
		}
		if(err) {
			res.session.flash = {
				type: 'danger',
				intro: 'Oops!',
				message: 'There was an error processing your submission. Pelase try again.'
			};
			return res.redirect(303, 'contest/vacation-photo');
		}
		var photo = files.photo;
		var dir = path.join(vacationPhotoDir, '/' + Date.now());
		var p = dir + '/' + photo.name;
		fs.mkdirSync(dir);
		fs.renameSync(photo.p, dir + '/' + photo.name);
		saveContestEntry('vacation-photo', fields.email, req.params.year, req.params.month, p);
		req.session.flash = {
			type: 'success',
			intro: 'Good luck!',
			message: 'You have been entered into the contest.',
		};
		return res.redirect(303, '/contest/vacation-photo/entries');
	});
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
	console.log(app.get('env'))
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

function saveContestEntry(contestName, email, year, month, photoPath) {
	// to do
}