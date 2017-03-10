const mongoose = require('mongoose');

before(done => {
  mongoose.connect('mongodb://localhost/tally25_test');
  mongoose.connection
    .once('open', done)
    .on('error', err => console.warn('Warning', err));
});

beforeEach(done => {
  const {users, tasks} = mongoose.connection.collections;

  users.drop()
  .then(() => tasks.drop())
  .then(() => done())
  .catch(() => done());
});
