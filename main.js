var http = require('http'),
		url = require('url'),
    path = require('path');
	fs = require('fs');

	// ADDED THIS FUNCTION HERE -----------------------------------------------------
	function handleStaticPages(pathName, res) {
	    var ext = path.extname(pathName);
	    switch(ext) {
	        case '.css':
	            res.writeHead(200, {"Content-Type": "text/css"});
	            fs.readFile('./' + pathName, 'utf8', function(err, fd) {
	                res.end(fd);
	            });
	            console.log('Routed for Cascading Style Sheet '+ pathName +' Successfully\n');
	        break;
	        case '.js':
	            res.writeHead(200, {"Content-Type": "text/javascript"});
	            fs.readFile('./' + pathName, 'utf8', function(err, fd) {
	                res.end(fd);
	            });
	            console.log('Routed for Javascript '+ pathName +' Successfully\n');
	        break;
	    }
	}
	// ADDED THIS FUNCTION HERE -----------------------------------------------------

var app = http.createServer(function (request, response) {
	var pathName = url.parse(request.url).pathname;
	var pathext = path.extname(pathName);
	if (pathext === '.js' || pathext === '.css') {
					 handleStaticPages(pathName, response);
	} else {
			fs.readFile("client.html", 'utf-8', function (error, data) {
				response.writeHead(200, {'Content-Type': 'text/html'});
				response.write(data);
				response.end();
			});
	}
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
					allClients.splice(i, 1);
					console.log("client "+user.name+" joined room "+user.room);
					io.sockets.emit("room_joined",{"name":user.partner.name});
					user.partner.socket.emit("room_joined",{"name":user.name});
					return;
				}
			}

			allClients.push(user);
			console.log("client "+user.name+" created room "+user.room);

		}
	});

	socket.on('message_to_server', function(data) {
		if(	user.partner!=null)
		{
			var escaped_message = data["message"];
			console.log(user.name + " sent msg "+escaped_message+ " to "+user.partner.name);
			user.partner.socket.emit("message_to_client",{ message: escaped_message });
		}
	});

	socket.on('disconnect', function () {

      socket.emit('disconnected');
			console.log("client "+user.name+" left room "+user.room);
			if(user.partner!=null)
			{
				console.log("client "+user.partner.name+" left room "+user.partner.room);
				user.partner.socket.emit('disconnected');
				user.partner = {'socket':user.partner.socket};
			}
			var index = allClients.indexOf(user);
			if (index > -1) {
			    allClients.splice(index, 1);
			}

			user = {'socket':socket};

  });
});
