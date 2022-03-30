const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const User = require('../lib/models/User');
const UserService = require('../lib/services/UserService');

describe('top-secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('signs up a user with a POST', async () => {
    const newUser = { email: 'clare@gmail.com', password: 'secretpassword' };
    const res = await request(app)
      .post('/api/v1/users')
      .send(newUser);
    
    expect(res.body).toEqual({ id: expect.any(String), email: 'clare@gmail.com' });
  });

  it('signs in a user with a POST', async () => {
    const user = await UserService.create({ email: 'clare@gmail.com', password: 'secretpassword' });
    const res = await request(app)
      .post('/api/v1/users/sessions')
      .send(user);
    
    expect(res.body).toEqual({ message: 'Signed in successfully!', user });
  });
});
