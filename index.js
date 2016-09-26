var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var db = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  const user_connected = 'user connected'.fontcolor("green");
  db.push(user_connected);
  socket.emit('chat_message', db.join('<br>'));
  socket.broadcast.emit('chat_message', user_connected);

  socket.on('chat_message', function(msg){
    db.push(msg);
    socket.broadcast.emit('chat_message', msg);
  });

  socket.on('disconnect', function(){
    const user_disconnected = 'user disconnected'.fontcolor("red");
    db.push(user_disconnected);
    socket.broadcast.emit('chat_message', user_disconnected);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
