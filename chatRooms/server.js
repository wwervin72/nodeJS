var http = require('http'); 				//提供http服务和客户端功能
var fs = require('fs');						//提供文件的I/O操作
var mime = require('mime');					//根据文件扩展名得出mime类型
var path = require('path'); 				//与文件路径相关功能
var cache = {};  							//缓存文件内容 

var server = http.createServer(function (req, res) {
	var filePath = false;

	if(req.url == '/'){
		filePath = 'public/index.html';
	}else{
		filePath = 'public/' + req.url;
	}
	var absPath = './' + filePath;
	serveStatic(res, cache, filePath);
});

server.listen(3000, function () {
	console.log('server is running at port ' + 3000);
});

var chatServer = require('./app/chat_server');
chatServer.listen(server);





//404错误处理函数
function send404(res) {
	// 设置响应头
	res.writeHead(404, {'Content-Type': 'text/plain'});
	res.write('Error 404: resource not found.');
	res.end();
}

// 提供文件数据服务, 先写出正确的http头, 然后发送文件内容
function sendFile (res, filePath, fileContents) {
	res.writeHead(200, {'Content-Type': mime.lookup(path.basename(filePath))});
	res.end(fileContents);
}

// 提供静态文件服务, 选确定文件是否缓存了, 如果是则返回它, 如果没有缓存则从硬盘中读取
function serveStatic (res, cache, absPath) {
	// 如果缓存中有该文件, 则直接返回该文件
	if(cache[absPath]){
		sendFile(res, absPath, cache[absPath]);
	}else{
		// 查询硬盘中是否存在该文件
		fs.exists(absPath, function (exists) {
			if(exists){
				// 如果存在读取该文件
				fs.readFile(absPath, function (err, content) {
					if(err){
						send404(res);
					}else{
						// 设置缓存
						cache[absPath] = content;
						sendFile(res, absPath, content);
					}
				})
			}else{
				// 不存在返回404错误
				send404(res);
			}
		});
	}
}