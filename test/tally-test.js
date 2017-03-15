const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const Task = require('../models/task');
const assert = require('assert');

describe('Tallies', () => {
  const agent = request.agent(app);
  let testUser;
  let testTask;

  beforeEach(done => {
    agent
      .post('/api/register')
      .send({username: 'testUser', password: 'tester'})
      .then(res => {
        testUser = res.body.user;
        done();
      });
  });

  beforeEach(done => {
    testTask = new Task({task: 'test', color: 'test', tallies: [{}], user: testUser});
    testTask.save()
      .then(() => done());
  });

  it('increments tally on increment request', done => {
    agent
      .put('/api/tallies/increment')
      .send({tallyId: testTask._id})
      .then(res => {
        assert(res.body === 'Success');
        return Task.findById(testTask._id);
      })
      .then(task => {
        assert(task.tallies[0].tally === 1);
        done();
      });
  });

  it('decrements tally on decrement request', done => {
    agent
      .put('/api/tallies/decrement')
      .send({tallyId: testTask._id})
      .then(res => {
        assert(res.body === 'Success');
        return Task.findById(testTask._id);
      })
      .then(task => {
        assert(task.tallies[0].tally === -1);
        done();
      });
  });
});
