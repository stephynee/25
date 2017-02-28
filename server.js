const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

const helpers = require('./helpers.js');

const app = express();
const port = 8080;
const ip = 'localhost';

const tempID = '58ac3f1d530f2368b113940c';

// mongoDB & mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/tallyDB');

const User = require('./models/user.js');
const Task = require('./models/task.js');

// middleware & settings
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));

// routes need to be refactored
app.get('/api/tallies', function(req, res) {
  User.findById(tempID)
  .populate('tasks')
  .exec(function(err, user) {
    if(err) return console.log(err);

    const today = new Date().setHours(0, 0, 0, 0);
    const taskRecentDate = user.tasks.length > 0 ? user.tasks[0].tallies[user.tasks[0].tallies.length - 1].date.setHours(0, 0, 0, 0) : today;

    if (today === taskRecentDate) {
      return res.json(user.tasks);
    }

    // create new tallys for the day if none exist
    Task.find({user: tempID}, function(err, tasks) {
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

  User.findById(tempID, function(err, user) {
    if(err) return console.log(err);

    Task.create(task, function(err, newTask) {
      if(err) return console.log(err);
      newTask.user = user;
      newTask.save();
      user.tasks.push(newTask);
      user.save();
      res.json(newTask);
    });
  });
});

app.put('/api/tallies', function(req, res) {
  Task.findById(req.body.data.id, function(err, foundTask) {
    if(err) return console.log(err);

    foundTask.color = req.body.data.color;
    foundTask.task = req.body.data.task;
    foundTask.save();
    res.json(foundTask);
  });
});

app.delete('/api/tallies', function(req, res) {
  User.findById(tempID, function(err, user) {
    if(err) return console.log(err);

    Task.findById(req.body.tallyId, function(err, task) {
      if(err) return console.log(err);

      user.tasks.pull({_id: task._id});
      user.save();
      task.remove();
      res.json('Success');
    });
  });
});

app.put('/api/tallies/increment', function(req, res) {
  Task.findById(req.body.tallyId, function(err, task) {
    if(err) return console.log(err);

    var i = task.tallies.length - 1;
    task.tallies[i].tally++;
    task.save();

    res.json('Success');
  });
});

app.put('/api/tallies/decrement', function(req, res) {
  Task.findById(req.body.tallyId, function(err, task) {
    if(err) return console.log(err);

    var i = task.tallies.length - 1;
    task.tallies[i].tally--;
    task.save();

    res.json('Success');
  });
});

app.get('/api/tallies/:range/:id', function(req, res) {
  var id = req.params.id;

  Task.findById(id, function(err, task) {
    if (err) throw err;

    var range = req.params.range.toLowerCase();
    var last = task.tallies.length - 1;
    var todayTally = task.tallies[last].tally;
    var todayTime = helpers.totalTime(todayTally);

    var data = helpers.buildRangeData(task, range);

    data.todayTally = todayTally;
    data.todayTime = todayTime;

    res.json(data);
  });
});

// Task.findById('58ac41b59028f06a9f935e21', function(err, task) {
//   var obj = {
//     tally: 10,
//     date: new Date(2017, 1, 7)
//   };
//
//   task.tallies.unshift(obj);
//   task.save();
//   console.log(task.tallies);
// });

app.listen(port, ip, () => console.log('server running'));
