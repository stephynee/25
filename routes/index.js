const express = require('express');

const router = express.Router();
const User = require('../models/user');
const Task = require('../models/task');
const helpers = require('../helpers');

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
      Task.update({user: userId}, {$push: {tallies: {}}}, {multi: true})
        .then(() => Task.find({user: userId}))
        .then(tasks => res.json(tasks));
    })
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

  User.findById(userId)
    .then(user => {
      newTask.user = user;
      return newTask.save();
    })
    .then(savedTask => res.json(savedTask))
    .catch(next);
});

router.put('/tallies', function(req, res, next) {
  const {id, color, task} = req.body.data;

  Task.findByIdAndUpdate(id, {task, color}, {new: true})
    .then(updatedTask => {
      res.json(updatedTask);
    })
    .catch(next);
});

router.delete('/tallies', function(req, res, next) {
  const {tallyId} = req.body;

  Task.findById(tallyId)
    .then(task => task.remove())
    .then(() => res.json('Success'))
    .catch(next);
});

router.put('/tallies/increment', function(req, res, next) {
  const {tallyId} = req.body;

  Task.findById(tallyId)
    .then(task => {
      const i = task.tallies.length - 1;

      task.tallies[i].tally++;
      return task.save();
    })
    .then(() => res.json('Success'))
    .catch(next);
});

router.put('/tallies/decrement', function(req, res, next) {
  const {tallyId} = req.body;

  Task.findById(tallyId)
    .then(task => {
      const i = task.tallies.length - 1;

      task.tallies[i].tally--;
      return task.save();
    })
    .then(() => res.json('Success'))
    .catch(next);
});

router.get('/tallies/:range/:id', function(req, res, next) {
  const {id} = req.params;

  Task.findById(id)
    .then(task => {
      const range = req.params.range.toLowerCase();
      const last = task.tallies.length - 1;
      const todayTally = task.tallies[last].tally;
      const todayTime = helpers.totalTime(todayTally);

      let data = helpers.buildRangeData(task, range);

      data.todayTally = todayTally;
      data.todayTime = todayTime;

      res.json(data);
    })
    .catch(next);
});

module.exports = router;
