const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 8080;
const ip = 'localhost';

// mongoDB & mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/tallyDB');

const User = require('./models/user.js');
const Task = require('./models/task.js');

// middleware & settings
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));

// temp stuff to remove when app is set up
// User.create({username: 'stephanie'}, (err, newUser) => {
//   if(err) {console.log(err)};
//   console.log(newUser);
// });

var tempData = [
  {
    task: 'Programming',
    tally: 10,
    id: 1,
    color: 'color-red'
  },
  {
    task: 'Drawing',
    tally: 2,
    id: 2,
    color: 'color-yellow'
  },
  {
    task: 'Writing',
    tally: 5,
    id: 3,
    color: 'color-green'
  },
  {
    task: 'Reading',
    tally: 1,
    id: 4,
    color: 'color-seafoam'
  },
  {
    task: 'Studying',
    tally: 12,
    id: 5,
    color: 'color-blue'
  }
];

// routes need to be refactored
app.get('/api/tallies', function(req, res) {
  User.findById('58989e697a2c1e2eb499cb25')
  .populate('tasks')
  .exec(function(err, user) {
    if(err) return console.log(err);
    res.json(user.tasks);
  });
});

app.post('/api/tallies', function(req, res) {
  var newTask = {
    task: req.body.data.task,
    tallies: [{}],
    color: req.body.data.color
  };
  // this needs to be tested to make sure that the tally object is being created using the default settings
  res.json(newTask);
});

app.put('/api/tallies', function(req, res) {
  var i = tempData.findIndex(obj => obj.id === req.body.data.id);
  tempData[i].task = req.body.data.task;
  tempData[i].color = req.body.data.color;

  res.json(tempData[i]);
});

app.delete('/api/tallies', function(req, res) {
  var i = tempData.findIndex(obj => obj.id === req.body.tallyId);
  tempData.splice(i, 1);
  res.json('Success');
});

app.listen(port, ip, () => console.log('server running'));
