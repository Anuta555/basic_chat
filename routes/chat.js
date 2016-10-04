module.exports = function(router) {
    router.get('/chat', function (req, res) {
        if(!req.user) {
            return res.redirect('/');
        }
//         res.render('chat', { user : req.user });
        res.sendFile(require('path').resolve('views/index.html'));
    });
};
