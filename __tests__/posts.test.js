const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

// Dummy user used for testing
const mockUser = {
  email: 'FirstLast123@testing.com',
  firstName: 'FirstName',
  lastName: 'LastName',
  password: 'password123',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockUser, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('post routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  const mockPost = {
    name: 'First Post',
    description: 'This is my first post',
    rating: 5,
    city: 'Austin',
    state: 'Texas',
    address: '1234 something lane',
    pictures: 'link to picture',
  };

  test('POST /api/v1/posts creates new post for authenticated user', async () => {
    const [agent, user] = await registerAndLogin();
    const resp = await agent.post('/api/v1/posts').send(mockPost);
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      user_id: user.id,
      description: mockPost.description,
      rating: mockPost.rating,
      city: mockPost.city,
      state: mockPost.state,
      address: mockPost.address,
      picture: mockPost.picture,
    });
  });
});
