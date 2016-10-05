module.exports = function(server) {
    var msg_db = [];

    var MongoStore = require('connect-mongo')(require('express-session'));
    var mongoStore = new MongoStore({ url: 'mongodb://localhost/basic_chat' });

    var socketio = require('socket.io');
    var passportSocketIo = require('passport.socketio');

    var io = socketio(server);

    io.use(passportSocketIo.authorize({
        key:          'connect.sid',
        secret:       process.env.SECRET_KEY_BASE,
        store:        mongoStore,
    }));

    io.on('connection', function(socket){
        socket.emit('chat_history', msg_db);

        socket.on('chat_message', function(msg){
            var message = JSON.stringify({
                m: msg,
                t: new Date().getTime(),
                n: socket.request.user.username
            });
            msg_db.push(message);
            io.emit('chat_message', message);
        });

        socket.on('disconnect', function(){
        });
    });
};
