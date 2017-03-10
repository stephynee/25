const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const Task = require('../models/task');

describe('Tasks POST route', () => {
  let testUser;
  let testTask = {data: {task: 'testTask', color: 'testColor'}};
  const agent = request.agent(app);

  beforeEach(done => {
    agent
      .post('/api/register')
      .send({username: 'testUser', password: 'test'})
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        testUser = res.body.user;
        done();
      });
  });

  it('creates a new task saved with the correct user', done => {
    agent
      .post('/api/tallies')
      .send(testTask)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Task.findOne({user: testUser._id})
          .then(task => {
            assert(task);
            done();
          });
      });
  });

  it('pushes new task to the user', done => {
    agent
      .post('/api/tallies')
      .send(testTask)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        User.findById(testUser._id)
          .populate('tasks')
          .then(user => {
            assert(user.tasks.length === 1);
            assert(user.tasks[0].task === 'testTask');
            done();
          });
      });
  });

  it('sends json with new task as successful response', done => {
    agent
      .post('/api/tallies')
      .send(testTask)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Task.find({})
          .then(tasks => {
            assert(tasks[0]._id.toString() === res.body._id);
            done();
          });
      });
  });
});
