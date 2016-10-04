var express = require('express');

var router = express.Router();
require('./entry')(router);
require('./chat')(router);

router.get('/', function (req, res) {
    if(req.user) {
        return res.redirect('/chat');
    }
    res.render('entry', { user : req.user });
});

module.exports = router;
