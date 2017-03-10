const express = require('express');

const router = express.Router();
const User = require('../models/user.js');
const Task = require('../models/task.js');
const helpers = require('../helpers.js');

const tempID = '58ac3f1d530f2368b113940c';

router.get('/tallies', function(req, res, next) {
  const userId = req.user._id;

  User.findById(userId)
    .populate('tasks')
    .then(user => {
      const today = new Date().setHours(0, 0, 0, 0);
      const taskRecentDate = user.tasks.length > 0 ? user.tasks[0].tallies[user.tasks[0].tallies.length - 1].date.setHours(0, 0, 0, 0) : today;

      // if tallies for the day exist, or if user has no tasks send current tasks array
      if(today === taskRecentDate) {
        return res.json(user.tasks);
      }

      // add tally for current day and then send tasks
      return Task.update({user: userId}, {$push: {tallies: {}}}, {multi: true});
    })
    .then(() => Task.find({user: userId}))
    .then(tasks => res.json(tasks))
    .catch(next);
});

router.post('/tallies', function(req, res, next) {
  const userId = req.user._id;
  const task = {
    task: req.body.data.task,
    tallies: [{}],
    color: req.body.data.color
  };
  const newTask = new Task(task);

  // create new task and save to user
  User.findById(userId)
    .then(user => {
      newTask.user = user;
      return newTask.save();
    })
    .then(savedTask => res.json(savedTask))
    .catch(next);
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
