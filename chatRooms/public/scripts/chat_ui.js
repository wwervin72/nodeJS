var socket = io.connect();
$(document).ready(function () {
	var chatApp = new Chat(socket);
	// 显示更名尝试的结果
	socket.on('nameResult', function (result) {
		var message;
		if(result.success){
			if(result.name.indexOf('游客') === 0){
				message = '欢迎你: ' + result.name + '。';
			}else{
				message = '恭喜你' + result.name + ', 你已经改名成功。';
			}
		}else{
			message = result.message;
		}
		$('#system_tips').append(divSystemContentElement(message));
	});

	// 显示房间更换结果
	socket.on('joinResult', function (result) {
		$('#current_room').text('坐标：'+result.room);
		$('#system_tips').append(divEscapedContentElement('你已经进入了：' + result.room + '房间。'));
	});

	// 显示用户的发言
	socket.on('message', function (message) {
		var newElement = $('<div></div>').text(message.text);
		// 判断是聊天信心还是系统信息
		if(message.infoCate === 'chatInfo'){
			newElement.addClass();
			$('#message').append(newElement.addClass('other'));
		}else{
			$('#system_tips').append(newElement);
		}
	});

	// 显示可用房间列表
	socket.on('rooms', function (data) {
		$('#room_list').empty();
		$('#room_list').append($('<div>聊天室列表</div>'));
		for(var room in data.rooms){
			room = room.substring(0, room.length);
			if(!data.guest[room]){
				$('#room_list').append(divEscapedContentElement(room));
			}
		}
		$('#room_list div').click(function () {
			if($('#current_room').text().indexOf($(this).text()) != -1){
				return false;
			}else{
				chatApp.processCommand('/join ' + $(this).text());
				$('#send_message').focus();
			}
		});
	});

	// 定期请求可用房间列表
	setInterval(function () {
		socket.emit('rooms');
	}, 1000);

	// 当输入表单获得焦点的时候，按下enter键，即可发送消息
	$('#send_message').focus(function () {
		// 这里如果使用jquery，如果输入有空格然后enter出现提示之后，后面再输入的话 都会弹出提示
		//就算只按了一次键盘，但是也会进入两次onkeydown
		document.onkeydown = function (event) {
			var event = event || window.event;
			if(event.keyCode === 13){
				if(event.preventDefault){
					event.preventDefault();
				}else{
					event.returnValue = false;
				}
				processUserInput(chatApp, socket);
			}
		};
	});
	// 提交表单发送聊天消息
})





// 用来显示可疑文本
function divEscapedContentElement (message) {
	return $('<div></div>').text(message);
}
// 用来显示系统创建的受信内容
function divSystemContentElement (message) {
	return $('<div></div>').html('<i>' + message + '</i>');
}

function processUserInput (chatApp, socket) {
	var message = $('#send_message').val().trim();
	if(!message.length){
		alert('请输入一些信息之后, 在进行尝试。');
		return;
	}
	var systemMessage;
	// 如果用户出入的内容以/开头，则把他当做聊天命令来处理
	if(message.charAt(0) == '/'){
		systemMessage = chatApp.processCommand(message);
		if(systemMessage){
			$('#message').append(divSystemContentElement(systemMessage));
		}
	}else{
		// 将非命令输入广播给其他用户
		chatApp.sendMessage($('#current_room').text(), message);
		message += ' :我'; 
		$('#message').append(divEscapedContentElement(message).addClass('ownInfo'));
		$('#message').scrollTop($('#message').prop('scrollHeight'));
	}
	$('#send_message').val('');
}