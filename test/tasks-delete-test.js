const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const Task = require('../models/task');

describe('DELETE to /api/tallies', () => {
  let testUser;
  const agent = request.agent(app);

  beforeEach(done => {
    agent
      .post('/api/register')
      .send({username: 'testUser', password: 'test'})
      .then(res => {
        testUser = res.body.user;
        done();
      });
  });

  it('removes task from database and user', done => {
    const testTask = new Task({task: 'test', color: 'test', tallies: [{}], user: testUser});

    testTask.save(() => {
      agent
        .del('/api/tallies')
        .send({tallyId: testTask._id})
        .then(res => {
          assert(res.body === 'Success');
          return Task.findById(testTask._id);
        })
        .then(task => {
          assert(!task);
          return User.findById(testUser._id);
        })
        .then(user => {
          assert(user.tasks.length < 1);
          done();
        });
    });
  });
});
