const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');

const helpers = require('./helpers.js');

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

// routes need to be refactored
app.get('/api/tallies', function(req, res) {
  User.findById('58989e697a2c1e2eb499cb25')
  .populate('tasks')
  .exec(function(err, user) {
    if(err) return console.log(err);

    const today = new Date().setHours(0, 0, 0, 0);
    const taskRecentDate = user.tasks.length > 0 ? user.tasks[0].tallies[user.tasks[0].tallies.length - 1].date.setHours(0, 0, 0, 0) : today;

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
  User.findById('58989e697a2c1e2eb499cb25', function(err, user) {
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

app.get('/api/tallies/:id/week', function(req, res) {
  Task.findById(req.params.id, function(err, task) {
    if (err) throw err;

    var last = task.tallies.length - 1;
    var weekStart = moment().startOf('week').valueOf();
    var weekEnd = moment().endOf('week').valueOf();
    var weekTallies = task.tallies.filter(tally => moment(tally.date).isBetween(weekStart, weekEnd));

    var todayTally = task.tallies[last].tally;
    var todayTime = helpers.totalTime(todayTally);
    var weekTally = weekTallies.reduce((a, b) => a + b.tally, 0);
    var weekTime = helpers.totalTime(weekTally);

    var data = {
      todayTally: todayTally,
      todayTime: todayTime,
      weekTally: weekTally,
      weekTime: weekTime
    };

    // eventually need to pass full tally data with dates to work into graph

    res.json(data);
  });
});

app.listen(port, ip, () => console.log('server running'));
