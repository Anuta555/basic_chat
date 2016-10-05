module.exports = function(server) {
    var msg_db = [];

    var MongoStore = require('connect-mongo')(require('express-session'));
    var mongoStore = new MongoStore({ url: 'mongodb://localhost/basic_chat' });

    var socketio = require('socket.io');
    var passportSocketIo = require('passport.socketio');
//     var cookieParser = require('cookie-parser');

    var io = socketio(server);

    io.use(passportSocketIo.authorize({
        key:          'connect.sid',
        secret:       process.env.SECRET_KEY_BASE,
        store:        mongoStore,
    }));

    io.on('connection', function(socket){
        console.log(socket.request.user);
        const user_connected = 'user connected'.fontcolor("green");
        msg_db.push(user_connected);
        socket.emit('chat_message', msg_db.join('<br>'));
        socket.broadcast.emit('chat_message', user_connected);

        socket.on('chat_message', function(msg){
            msg_db.push(msg);
            socket.broadcast.emit('chat_message', msg);
        });

        socket.on('disconnect', function(){
            const user_disconnected = 'user disconnected'.fontcolor("red");
            msg_db.push(user_disconnected);
            socket.broadcast.emit('chat_message', user_disconnected);
        });
    });
};
