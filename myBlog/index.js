const path = require('path');
const express = require('express');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const config = require('config-lite');
const routes = require('./routes');
const pkg = require('./package');
const mongoose = require('mongoose');

const app = express();

mongoose.Promise = global.Promise;
const db = mongoose.connect(config.mongodb);

// 设置模版路径
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// session中间件
app.use(session({
	name: config.session.key, //设置cookie中保存session id的名称
	secret: config.session.secret, //设置通过secret来计算hash值，并放在cookie中，使产生signedCookie防篡改
	cookie: {
		maxAge: config.session.maxAge
	},
	store: new mongoStore({
		// 将session存储到MongoDB上
		url: config.mongodb
	})
}));

// flash用来显示通知
app.use(flash());

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
	encoding: 'utf-8',
	uploadDir: path.join(__dirname, 'public/upload'), //上传文件目录
	keepExtensions: true //保留后缀
}));

// 设置模板全局变量
app.locals.blog = {
	title: pkg.name,
	description: pkg.description
};

app.use(function (req, res, next) {
	res.locals.user = req.session.user;
	res.locals.success = req.flash('success').toString();
  	res.locals.error = req.flash('error').toString();
  	next();
});

// 路由
routes(app);

app.listen(config.port, function () {
	console.log('server is running on port 3000');
});