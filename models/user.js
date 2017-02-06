const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
});

module.exports = mongoose.model('User', userSchema);
