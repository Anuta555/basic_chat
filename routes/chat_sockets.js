module.exports = function(server) {
    var redis = require('redis');
    var redisClient = redis.createClient();

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
        redisClient.lrange('chat_messages', 0, -1, function(err, reply) {
            if(err) {
                return console.log('Chat history db error: ' + err); // TODO
            }
            socket.emit('chat_history', reply);
        });

        socket.on('chat_message', function(msg){
            var message = JSON.stringify({
                m: msg,
                t: new Date().getTime(),
                n: socket.request.user.username
            });
            redisClient.rpush('chat_messages', message);
            io.emit('chat_message', message);
        });

        socket.on('disconnect', function(){
        });
    });


};
