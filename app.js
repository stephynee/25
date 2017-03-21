const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const favicon = require('serve-favicon');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const helpers = require('./helpers');

const User = require('./models/user');

const auth = require('./routes/auth');
const index = require('./routes/index');

const app = express();

// mongoDB & mongoose
mongoose.Promise = global.Promise;
if(process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/tallyDB');
}

// auth config
app.use(session({
  secret: 'I am the secret to end all secrets',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware & settings
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(favicon(path.join(__dirname, '/public', 'favicon.ico')));

// routes
app.use('/api', auth);
app.use('/api', index);

app.use(helpers.sendError);

module.exports = app;
