const express = require('express');

const router = express.Router();
const passport = require('passport');
const User = require('../models/user.js');

router.post('/register', (req, res, next) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if(err) {
      next(err);
    }

    passport.authenticate('local')(req, res, () => {
      return res.status(200).json({success: 'Successfully registered', user: user});
    });
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if(err) {
      next(err);
    }

    if(!user) {
      return res.status(401).json({error: info.message});
    }

    req.login(user, err => {
      if(err) {
        next(err);
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
  if(!req.isAuthenticated()) {
    return res.status(200).json({status: false});
  }

  res.status(200).json({status: true});
});

module.exports = router;
