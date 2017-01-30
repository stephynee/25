var express = require('express');

var app = express(),
    port = 8080,
    ip = 'localhost';

app.use(express.static(__dirname + '/public'));

var tempData = [
  {
    task: 'Programming',
    tally: 10
  },
  {
    task: 'Drawing',
    tally: 2
  },
  {
    task: 'Writing',
    tally: 5
  },
  {
    task: 'Reading',
    tally: 1
  },
  {
    task: 'Studying',
    tally: 12
  }
];

app.get('/api/tallies', function(req, res) {
  res.json(tempData);
});

app.listen(port, ip, () => console.log('server running'));
