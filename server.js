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

    var today = new Date().setHours(0, 0, 0, 0);
    var taskRecentDate = user.tasks.length > 0 ? user.tasks[0].tallies[0].date.setHours(0, 0, 0, 0) : today;

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
  var newTask = {
    task: req.body.data.task,
    tallies: [{}],
    color: req.body.data.color
  };

  User.findById('58989e697a2c1e2eb499cb25', function(err, user) {
    if(err) return console.log(err);

    Task.create(newTask, function(err, newTask) {
      if(err) return console.log(err);
      newTask.user = user;
      newTask.save();
      user.tasks.push(newTask);
      user.save();
      console.log(newTask.tallies);
    });
  });
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
