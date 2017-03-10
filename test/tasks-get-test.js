const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const Task = require('../models/task');

describe('Tasks GET route', () => {
  let testUser;
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

  it('creates new tallies for single task', done => {
    const task = {task: 'test', color: 'test', tallies: [{date: new Date(2017, 2, 26)}], user: testUser};

    Task.create(task)
      .then(task => {
        return User.findByIdAndUpdate(testUser._id, {$push: {tasks: task}});
      })
      .then(() => {
        agent
          .get('/api/tallies')
          .end((err, res) => {
            if(err) {
              return done(err);
            }
            assert(res.body[0].tallies.length === 2);
            done();
          });
      });
  });

  it('creates new tallies on multiple tasks', done => {
    const task1 = new Task({task: 'test', color: 'test', tallies: [{date: new Date(2017, 2, 26)}], user: testUser});
    const task2 = new Task({task: 'test2', color: 'test2', tallies: [{date: new Date(2017, 2, 26)}], user: testUser});

    Promise.all([task1.save(), task2.save()])
      .then(tasks => {
        return User.findByIdAndUpdate(testUser._id, {$push: {tasks: {$each: tasks}}});
      })
      .then(() => {
        agent
          .get('/api/tallies')
          .end((err, res) => {
            if(err) {
              return done(err);
            }

            assert(res.body[0].tallies.length === 2);
            assert(res.body[1].tallies.length === 2);
            done();
          });
      });
  });

  it('returns empty array if user has no tasks', done => {
    agent
      .get('/api/tallies')
      .end((err, res) => {
        assert(res.body.length === 0);
        done();
      });
  });

  // it('returns tasks if tallies for the day already exist', done => {
  //
  // });
  //
  // it('returns an error if something goes wrong', done => {
  //
  // });
});
