var http = require('http'),
	fs = require('fs');

var app = http.createServer(function (request, response) {
	fs.readFile("client.html", 'utf-8', function (error, data) {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write(data);
		response.end();
	});
}).listen(1337);


var allClients = [];

var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket) {
	var user = {'socket':socket};
	socket.on('join_room', function(data) {
		if(user.room == null)
		{
			user.room = data["room"];
			user.name = data["name"];
			for (var i = 0; i < allClients.length; i++) {
				if(allClients[i].room!=null && allClients[i].partner==null && allClients[i].room==user.room)
				{
					user.partner=allClients[i];
					allClients[i].partner=user;
					console.log("client "+user.name+" joined room "+user.room);
					io.sockets.emit("room_joined",{"name":allClients[i].name});
					user.partner.socket.emit("room_joined",{"name":user.name});
				}
			}

			allClients.push(user);
			if(	user.partner==null)
			{
				console.log("client "+user.name+" created room "+user.room);
			}
		}
	});

	socket.on('message_to_server', function(data) {
		if(connected>0)
		{
			var escaped_message = data["message"];
			console.log(escaped_message);
			io.sockets.emit("message_to_client",{ message: escaped_message });
		}
	});

	socket.on('disconnect', function () {

      socket.emit('disconnected');

  });
});
