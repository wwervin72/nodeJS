var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

//定义聊天服务器函数Listen，他启动socket.IO服务器, 限定socket.IO向控制台输出的日志的详细程度, 并确定该如何处理每个接进来的链接
exports.listen = function (server) {
	// 启动socket.IO服务器，允许他搭载在已有的http服务器上
	io = socketio.listen(server);
	io.set('log level', 1);
	// 定义每个用户连接的处理逻辑
	 // 向my room广播一个事件，提交者会被排除在外（即不会收到消息）
	io.sockets.on('connection', function (socket) {
		// 在用户连接上来时，赋予其一个访客名
		guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
		// 在用户链接上来时，把它放入聊天室lobby
		joinRoom(socket, '聊天室1');
		// 处理用户的消息、更名以及聊天室的创建变更
		handleMessageBroadcasting(socket, nickNames);
		handleNameChangeAttempts(socket, nickNames, namesUsed);
		handleRoomJoining(socket);

		// 用户发出请求时, 向其提供聊天室的列表
		socket.on('rooms', function () {
			socket.emit('rooms', {
				guest: nickNames,
				rooms: io.sockets.adapter.rooms
			});
		});

		// 定义用户连接断开后的逻辑
		handleClientDisconnection(socket, nickNames, namesUsed);
	});
}

// 用户连接上来生成新的昵称
function assignGuestName (socket, guestNumber, nickNames, namesUsed) {
	// 生成新的昵称
	var name = '游客' + guestNumber;
	// 把用户昵称和客户端连接ID关联上
	nickNames[socket.id] = name;
	// 让用户知道他们的昵称
	socket.emit('nameResult', {
		success: true,
		name: name
	});
	// 存放已经占用的昵称
	namesUsed.push(name);
	// 增加用来生成昵称的计数器
	return guestNumber + 1;
}

// 进入新的房间
function joinRoom (socket, room) {
	// 让用户进入房间
	socket.join(room);
	// 记录用户当前房间
	currentRoom[socket.id] = room;
	// 让用户知道他们进入了新的房间
	socket.emit('joinResult', {
		room: room
	});
	// 让房间里的其他用户知道有新用户进入了这个房间
	socket.broadcast.to(room).emit('message', {
		text: nickNames[socket.id] + ' 进入了 ' + room + '房间。',
		infoCate: 'newUser'
	});
	// 确定有哪些用户在这个房间
	// 获取particular room中的客户端，返回所有在此房间的socket实例
	// socket.io version < 1 正确
	// var usersInRoom = io.sockets.clients(room);
	// socket.io version 1.3.x:
	// var usersInRoom = io.sockets.adapter.rooms[room];
	// socket.io version 1.0.x to 1.2.x:
	// var usersInRoom = io.adapter.rooms[room];
	// version > 1.4 这么写
	// http://stackoverflow.com/questions/9352549/getting-how-many-people-are-in-a-chat-room-in-socket-io
	var usersInRoom = io.sockets.adapter.rooms[room];
	if(usersInRoom.length){
		var count = 0;
		var usersInRoomSummary = '当前房间里的人有: ';
		for(var prop in usersInRoom.sockets){
			if(count > 0){
				usersInRoomSummary += ', ';
			}
			count++;
			usersInRoomSummary += nickNames[prop];
		}
		usersInRoomSummary += '。';
		socket.emit('message', {text: usersInRoomSummary, infoCate: "userList"});
	}
}

// 更改用户名
function handleNameChangeAttempts (socket, nickNames, namesUsed) {
	// 添加nameAttempt事件的监听器
	socket.on('nameAttempt', function (name) {
		if(name.indexOf('游客') == 0){
			// 昵称不能以Guest开头
			socket.emit('nameResult', {
				success: false,
				message: '名称不能以"游客"开头'
			});
		}else{
			if(namesUsed.indexOf(name) == -1){
				// 如果昵称没有被使用，则可以注册
				var previousName = nickNames[socket.id];
				var previousNameIndex = namesUsed.indexOf(previousName);
				namesUsed.push(name);
				nickNames[socket.id] = name;
				// 删掉用户之前的昵称
				delete namesUsed[previousNameIndex];
				socket.emit('nameResult', {
					success: true,
					name: name
				});
				socket.broadcast.to(currentRoom[socket.id]).emit('message', {
					text: previousName + ' 改名成功, 现在叫做: ' + name + '。',
					infoCate: 'modyfyName'
				});
			}else{
				socket.emit('nameResult', {
					success: false,
					massage: '该名称已被占用。'
				});
			}
		}
	})
}

// 发送消息
function handleMessageBroadcasting (socket) {
	socket.on('message', function (message) {
		// 向发送消息的这个房间，广播消息
		socket.broadcast.to(message.room).emit('message', {
			text: nickNames[socket.id] + ': ' + message.text,
			infoCate: 'chatInfo'
		});
	});
}

// 更换房间
function handleRoomJoining (socket) {
	socket.on('join', function (room) {
		socket.leave(currentRoom[socket.id]);
		joinRoom(socket, room.newRoom);
	});
}

// 用户断开
function handleClientDisconnection (socket, nickNames, namesUsed) {
	socket.on('disconnect', function () {
		var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
		delete namesUsed[nameIndex];
		delete nickNames[socket.id];
	})
}