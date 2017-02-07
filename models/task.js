const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task: String,
  color: String,
  tallies: [{
    _id: false,
    date: {type: Date, default: Date.now},
    tally: {type: Number, default: 0}
  }],
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'Task'}
});

module.exports = mongoose.model('Task', taskSchema);
