
module.exports = function(server, passport, mongoStore) {
    var msg_db = [];

    var socketio = require('socket.io');
    var passportSocketIo = require('passport.socketio');
//     var cookieParser = require('cookie-parser');

    var io = socketio(server);

    io.use(passportSocketIo.authorize({
//         cookieParser: cookieParser,
        key:          'connect.sid',
        secret:       'aaa',
        store:        mongoStore,
        success:      onAuthorizeSuccess,
        fail:         onAuthorizeFail,
        passport:     passport
    }));

    function onAuthorizeSuccess(data, accept){
        console.log('successful connection to socket.io');
        accept();
    }

    function onAuthorizeFail(data, message, error, accept){
        if(error)
            accept(new Error(message));
        console.log('failed connection to socket.io:', message);
    }

    io.on('connection', function(socket){
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
