const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

describe('Authentication routes', () => {
  beforeEach(done => {
    User.register(new User({username: 'testUser'}), 'testing', (err, user) => {
      if(err) {
        return done(err);
      }
      
      done();
    });
  });

  it('registers a new user on POST to /api/register', done => {
    request(app)
      .post('/api/register')
      .send({username: 'tester', password: 'test'})
      .end(() => {
        User.findOne({username: 'tester'})
          .then(user => {
            assert(user.username === 'tester');
            done();
          });
      });
  });

  it('sends error response if POST to /api/register fails', done => {
    request(app)
      .post('/api/register')
      .send({username: 'tester'})
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        assert(res.body.err);
        done();
      });
  });

  it('logs in a user on /api/login', done => {
    request(app)
      .post('/api/login')
      .send({username: 'testUser', password: 'testing'})
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        assert(res.body.status === 'Successful login');
        assert(res.status === 200);
        done();
      });
  });

  it('sends an error if POST to /api/login fails', done => {
    request(app)
      .post('/api/login')
      .send({username: 'testing', password: 'testing'})
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        assert(res.status === 401);
        assert(res.body.error);
        done();
      });
  });
});
