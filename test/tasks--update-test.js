const assert = require('assert');
const app = require('../app');
const request = require('supertest');
const Task = require('../models/task');

describe('PUT to /api/tallies', () => {
  let testUser;
  const agent = request.agent(app);

  beforeEach(done => {
    agent
      .post('/api/register')
      .send({username: 'testUser', password: 'test'})
      .end((err, res) => {
        if(err) {
          done(err);
        }

        testUser = res.body.user;
        done();
      });
  });

  it('updates the appropriate task', done => {
    const testTask = new Task({task: 'Task', color: 'Color', tallies: [{}], user: testUser});

    testTask.save()
      .then(() => {
        agent
          .put('/api/tallies')
          .send({data: {id: testTask._id, task: 'New task', color: 'New color'}})
          .end((err, res) => {
            if(err) {
              done(err);
            }

            assert(res.body.task !== testTask.task);
            assert(res.body.task === 'New task');
            assert(res.body.color === 'New color');
            done();
          });
      });
  });
});
