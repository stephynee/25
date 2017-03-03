const express = require('express');

const router = express.Router();
const User = require('../models/user.js');
const Task = require('../models/task.js');
const helpers = require('../helpers.js');

const tempID = '58ac3f1d530f2368b113940c';

router.get('/tallies', function(req, res) {
  console.log(req.user);
  User.findById(req.user._id)
  .populate('tasks')
  .exec(function(err, user) {
    if(err) return console.log(err);

    const today = new Date().setHours(0, 0, 0, 0);
    const taskRecentDate = user.tasks.length > 0 ? user.tasks[0].tallies[user.tasks[0].tallies.length - 1].date.setHours(0, 0, 0, 0) : today;

    if (today === taskRecentDate) {
      return res.json(user.tasks);
    }

    // create new tallys for the day if none exist
    Task.find({user: req.user._id}, function(err, tasks) {
      if(err) return console.log(err);

      tasks.forEach(task => {
        task.tallies.push({});
        task.save();
      });

      res.json(tasks);
    });
  });
});

router.post('/tallies', function(req, res) {
  const task = {
    task: req.body.data.task,
    tallies: [{}],
    color: req.body.data.color
  };

  User.findById(req.user._id, function(err, user) {
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

router.put('/tallies', function(req, res) {
  Task.findById(req.body.data.id, function(err, foundTask) {
    if(err) return console.log(err);

    foundTask.color = req.body.data.color;
    foundTask.task = req.body.data.task;
    foundTask.save();
    res.json(foundTask);
  });
});

router.delete('/tallies', function(req, res) {
  User.findById(req.user._id, function(err, user) {
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

router.put('/tallies/increment', function(req, res) {
  Task.findById(req.body.tallyId, function(err, task) {
    if(err) return console.log(err);

    const i = task.tallies.length - 1;

    task.tallies[i].tally++;
    task.save();

    res.json('Success');
  });
});

router.put('/tallies/decrement', function(req, res) {
  Task.findById(req.body.tallyId, function(err, task) {
    if(err) return console.log(err);

    const i = task.tallies.length - 1;
    task.tallies[i].tally--;
    task.save();

    res.json('Success');
  });
});

router.get('/tallies/:range/:id', function(req, res) {
  const id = req.params.id;

  Task.findById(id, function(err, task) {
    if (err) throw err;

    const range = req.params.range.toLowerCase();
    const last = task.tallies.length - 1;
    const todayTally = task.tallies[last].tally;
    const todayTime = helpers.totalTime(todayTally);

    let data = helpers.buildRangeData(task, range);

    data.todayTally = todayTally;
    data.todayTime = todayTime;

    res.json(data);
  });
});

module.exports = router;
