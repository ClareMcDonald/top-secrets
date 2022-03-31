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
    const userData = { email: 'clare@gmail.com', password: 'secretpassword' };
    const user = await UserService.create(userData);

    const agent = request.agent(app);
    const res = await agent
      .post('/api/v1/users/sessions')
      .send(userData);
    
    expect(res.body).toEqual({ message: 'Signed in successfully!', user });
  });

  it('logs out a user', async () => {
    const userData = { email: 'clare@gmail.com', password: 'secretpassword' };

    const agent = request.agent(app);

    await agent
      .post('/api/v1/users/sessions')
      .send(userData);
    
    const res = await agent
      .delete('/api/v1/users/sessions')
      .send(userData);
    
    expect(res.body).toEqual({ success: true, message: 'Successfully signed out!' });
  });

  it('gets a list of secrets for signed in users', async () => {
    const userData = { email: 'clare@gmail.com', password: 'secretpassword' };

    const agent = request.agent(app);
    await agent
      .post('/api/v1/users')
      .send({ email: 'clare@gmail.com', password: 'secretpassword' });
    
    await agent
      .post('/api/v1/users/sessions')
      .send({ email: 'clare@gmail.com', password: 'secretpassword' });
    
    const res = await agent
      .get('/api/v1/secrets');
    
    expect(res.body).toEqual([{ createdAt: expect.any(String), description: 'Tilly is great!', title: 'urgent secret', id: expect.any(String) }]);

  });
});
