var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  io.emit('chat_message', 'user connected'.fontcolor("green"));

  socket.on('chat_message', function(msg){
    socket.broadcast.emit('chat_message', msg);
  });

  socket.on('disconnect', function(){
    socket.broadcast.emit('chat_message', 'user disconnected'.fontcolor("red"));
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
