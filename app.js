var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname));

io.on('connection', function(client) {
    // console.log('Client connected...');

    // client.emit('messages', {hello: 'world'});

    client.on('join', function(name) {
        client.nickname = name;
        console.log(name + " joined the chat")
    });

    client.on('messages', function(data) {
        // console.log(data);
        
        var nickname = client.nickname;
        
        console.log(nickname + " said: " + data)
        
        client.broadcast.emit("messages", nickname + ": " + data);

        client.emit("messages", nickname + ": " + data);
    });
});

app.get('/', function(req , res) {
    res.sendFile(__dirname + '/index.html');
})

server.listen(8080);