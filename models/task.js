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

// push the new task into user whenever a new task is saved
taskSchema.post('save', function(next) {
  const user = mongoose.model('User');

  user.update({_id: this.user}, {$push: {tasks: this}})
    .then(next);
});

module.exports = mongoose.model('Task', taskSchema);
