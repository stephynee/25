var express = require('express');

var app = express(),
    port = 8080,
    ip = 'localhost';

//what does this do? why do I always need to set this up?
app.use(express.static(__dirname + '/public'));

var tempData = [

];

app.get('/api/tallies', function(req, res) {
  res.json(tempData);
});

app.listen(port, ip, () => console.log('server running'));
