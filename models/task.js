const mongoose = require('mongoose');

const User = mongoose.model('User');

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

taskSchema.pre('remove', function(next) {
  User.update({_id: this.user}, {$pull: {tasks: this._id}})
    .then(next);
});

module.exports = mongoose.model('Task', taskSchema);
