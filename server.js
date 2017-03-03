const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

const User = require('./models/user.js');

const auth = require('./routes/auth.js');
const index = require('./routes/index.js');

const app = express();
const port = 8080;
const ip = 'localhost';

// auth config
app.use(session({
  secret: 'I am the secret to end all secrets',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// mongoDB & mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/tallyDB');

// middleware & settings
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));

// routes
app.use('/api', auth);
app.use('/api', index);

app.listen(port, ip, () => console.log('server running'));
