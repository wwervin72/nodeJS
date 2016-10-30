var Chat = function (socket) {
	this.socket = socket;
};

Chat.prototype.sendMessage = function (room, text) {
	var message = {
		room: room,
		text: text
	};
	this.socket.emit('message', message);
};

Chat.prototype.changeRoom = function (room) {
	this.socket.emit('join', {
		newRoom: room
	});
};

Chat.prototype.processCommand = function (command) {
	var words = command.split(' ');
	// 从第一个消息开始解析命令
	var command = words[0].substring(1, words[0].length).toLowerCase();
	var message = false;
	switch(command){
		case 'join': 
			// 处理房间变换/创建
			words.shift();
			var room = words.join(' ');
			this.changeRoom(room);
			break;
		case 'nick':
			// 处理更名尝试
			words.shift();
			var name = words.join(' ');
			this.socket.emit('nameAttempt', name);
			break;
		default: 
			// 如果命令无法识别，返回错误消息
			message = 'Unrecognized command.';
			break;
	}
	return message;
}

