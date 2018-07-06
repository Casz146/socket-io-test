var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
// var redis = require('redis');
// var redisclient = redis.createClient();

app.use(express.static(__dirname));

/* REDIS TEST */
// redisclient.set("message1", "hello1");
// redisclient.set("message2", "hello2");

// redisclient.get("message1", function(err, reply){
//     console.log(reply);
// })

var messages = [];

var storeMessage = function(name, data) {
    messages.push({name: name, data: data});
    if (messages.length > 10) {
        messages.shift();
    }
}

io.sockets.on('connection', function (client) {
    // console.log('Client connected...');

    // client.emit('messages', {hello: 'world'});

    client.on('join', function (name) {
        client.nickname = name;
        client.broadcast.emit("messages", name + " joined the chat")
        console.log(name + " joined the chat")
        messages.forEach(function(message) {
            client.emit("messages", message.name + ": " + message.data)
        });
    });

    client.on('messages', function (data) {
        // console.log(data);
        var nickname = client.nickname;
        console.log(nickname + " said: " + data)
        client.broadcast.emit("messages", nickname + ": " + data);
        client.emit("messages", nickname + ": " + data);

        storeMessage(nickname,data);
    });
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

server.listen(8080);