module.exports = function(router) {
    router.get('/chat', function (req, res) {
        if(!req.user) {
            return res.redirect('/');
        }
        res.sendFile(require('path').resolve('views/chat.html'));
    });
};
