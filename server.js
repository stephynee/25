var express = require('express'),
    bodyParser = require('body-parser');

var app = express(),
    port = 8080,
    ip = 'localhost';

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

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
  res.json('success');
});

app.listen(port, ip, () => console.log('server running'));
