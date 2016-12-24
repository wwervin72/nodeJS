var nodemailer = require('nodemailer');

module.exports = function (credentials) {
	var mailTransport = nodemailer.createTransport('smtps://'+credentials.gmail.user+'%40gmail.com:'+credentials.gmail.password+'@smtp.gmail.com');
	var fm = '"Meadowlark Travel" <info@meadowlarktravel.com>';
	return {
		send: function(to, subj, body){
			mailTransport.sendMail({
				from: fm,
				to: to,
				subject: subj,
				html: body,
				generateTextFromHtml: true
				}, function(err){
					if(err) {
						console.error('Unable to send email: ' + err);
					}
				});
		},
		emailError: function(message, filename, exception){
			var body = '<h1>Meadowlark Travel Site Error</h1>';
				body += 'message:<br><pre>' + message + '</pre><br>';
			if(exception){
				body += 'exception:<br><pre>' + exception + '</pre><br>';
			}
			if(filename){
				body += 'filename:<br><pre>' + filename + '</pre><br>';
			} 
			
			mailTransport.sendMail({
				from: from,
				to: errorRecipient,
				subject: 'Meadowlark Travel Site Error',
				html: body,
				generateTextFromHtml: true
				}, function(err){
					if(err){
						console.error('Unable to send email: ' + err);
					} 
				}
			);
		}
	}
}