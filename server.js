const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;
const ip = 'localhost';

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));

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

app.get('/api/tallies', function(req, res) {
  res.json(tempData);
});

app.post('/api/tallies', function(req, res) {
  var newTask = {
    task: req.body.data.task,
    tally: 0,
    id: Math.random(),
    color: req.body.data.color
  };

  tempData.push(newTask);

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
