var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http)


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('connected')

    //nghe tin nhắn từ đường truyền chat message
    socket.on('chat message', function(msg){
        console.log("message:", msg)
        //truyền tin cho tất cả mọi client connect với server
        socket.broadcast.emit('chat message', msg);
    })
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});