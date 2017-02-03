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
    id: 1
  },
  {
    task: 'Drawing',
    tally: 2,
    id: 2
  },
  {
    task: 'Writing',
    tally: 5,
    id: 3
  },
  {
    task: 'Reading',
    tally: 1,
    id: 4
  },
  {
    task: 'Studying',
    tally: 12,
    id: 5
  }
];

app.get('/api/tallies', function(req, res) {
  res.json(tempData);
});

app.post('/api/tallies', function(req, res) {
  var data = req.body.data;
  console.log(data);
  res.json('success');
});

app.listen(port, ip, () => console.log('server running'));
