const express = require('express');

const router = express.Router();
const passport = require('passport');
const User = require('../models/user.js');

router.post('/register', function(req, res) {
  User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
    if (err) {
      return res.status(500).json({error: err.message});
    }

    passport.authenticate('local')(req, res, function() {
      return res.status(200).json({success: 'Successfully registered'});
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({error: info.message});
    }

    req.login(user, function(err) {
      if (err) {
        return res.status(500).json({error: err.message});
      }
      res.status(200).json({status: 'Successful login'});
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({status: 'User logged out'});
});

router.get('/userstatus', function(req, res) {
  // allow client to check if user is logged in and send appropriate response
  if (!req.isAuthenticated()) {
    return res.status(200).json({status: false});
  }

  res.status(200).json({status: true});
});

module.exports = router;
