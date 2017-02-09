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

// routes need to be refactored
app.get('/api/tallies', function(req, res) {
  User.findById('58989e697a2c1e2eb499cb25')
  .populate('tasks')
  .exec(function(err, user) {
    if(err) return console.log(err);

    const talliesLength = user.tasks[0].length;
    const today = new Date().setHours(0, 0, 0, 0);
    const taskRecentDate = talliesLength > 0 ? user.tasks[0].tallies[talliesLength - 1].date.setHours(0, 0, 0, 0) : today;

    if (today === taskRecentDate) {
      return res.json(user.tasks);
    }

    // create new tallys for the day if none exist
    Task.find({user: '58989e697a2c1e2eb499cb25'}, function(err, tasks) {
      if(err) return console.log(err);

      tasks.forEach(task => {
        task.tallies.push({});
        task.save();
      });

      res.json(tasks);
    });
  });
});

app.post('/api/tallies', function(req, res) {
  var task = {
    task: req.body.data.task,
    tallies: [{}],
    color: req.body.data.color
  };

  User.findById('58989e697a2c1e2eb499cb25', function(err, user) {
    if(err) return console.log(err);

    Task.create(task, function(err, newTask) {
      if(err) return console.log(err);
      newTask.user = user;
      newTask.save();
      user.tasks.push(newTask);
      user.save();
      console.log(newTask.tallies);
      res.json(newTask);
    });
  });
});

app.put('/api/tallies', function(req, res) {
  console.log(req.body.data);
  Task.findById(req.body.data.id, function(err, foundTask) {
    if(err) return console.log(err);

    foundTask.color = req.body.data.color;
    foundTask.task = req.body.data.task;
    foundTask.save();
    res.json(foundTask);
  });
});

app.delete('/api/tallies', function(req, res) {
  var i = tempData.findIndex(obj => obj.id === req.body.tallyId);
  tempData.splice(i, 1);
  res.json('Success');
});

app.listen(port, ip, () => console.log('server running'));
