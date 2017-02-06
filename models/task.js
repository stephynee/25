const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task: String,
  color: String,
  tallies: [{
    date: {type: Date, default: Date.now},
    tally: {type: Number, default: 0}
  }]
});

module.exports = mongoose.model('Task', taskSchema);
