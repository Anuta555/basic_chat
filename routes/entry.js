var passport = require('passport');
var Account = require('../models/account');

module.exports = function(router) {
    router.get('/register', function(req, res) {
        res.render('register', { });
    });

    router.post('/register', function(req, res, next) {
        Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
            if (err) {
              return res.render('register', { error : err.message });
            }

            passport.authenticate('local')(req, res, function () {
                req.session.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.redirect('/');
                });
            });
        });
    });


    router.get('/login', function(req, res) {
        res.render('login', { user : req.user, error : req.flash('error')});
    });

    router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), function(req, res, next) {
        req.session.save(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    });

    router.get('/logout', function(req, res, next) {
        req.logout();
        req.session.save(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    });
};
