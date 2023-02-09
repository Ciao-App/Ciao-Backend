const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const Post = require('../lib/models/Post');

//* Dummy user used for testing
const mockUser = {
  email: 'FirstLast123@testing.com',
  firstName: 'FirstName',
  lastName: 'LastName',
  password: 'password123',
};
// const mockUser2 = {
//   email: 'SecondUser@testing.com',
//   firstName: 'SecondUser',
//   lastName: 'SecondUser',
//   password: 'password123',
// };
//* Same logic for user tests - creating a user and signing them in
const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });
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
  //* mock post for testing
  const mockPost = {
    name: 'First Post',
    description: 'This is my first post',
    rating: '5',
    city: 'Austin',
    state: 'Texas',
    address: '1234 something lane',
    pictures: 'link to picture',
  };
  const mockPost2 = {
    name: 'Second Post',
    description: 'This is my second post',
    rating: '1',
    city: 'Houston',
    state: 'Texas',
    address: '9876 something lane',
    pictures: 'link to picture',
  };

  //* POST route test - current user can create a post
  test('POST /api/v1/posts', async () => {
    const [agent, user] = await registerAndLogin();
    const resp = await agent.post('/api/v1/posts').send(mockPost);
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      id: expect.any(String),
      user_id: user.id,
      name: mockPost.name,
      description: mockPost.description,
      rating: mockPost.rating,
      city: mockPost.city,
      state: mockPost.state,
      address: mockPost.address,
      pictures: mockPost.pictures,
    });
  });

  //* GET route test
  // get post by id
  test('GET /api/v1/posts/:id', async () => {
    const [agent, user] = await registerAndLogin();
    const userPost = await Post.insert({
      user_id: user.id,
      ...mockPost2,
    });
    const resp = await agent.get('/api/v1/posts/1');
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual(userPost);
  });
  // get all posts by userId
  test('GET /api/v1/posts/user/1', async () => {
    const [agent, user] = await registerAndLogin();
    const userPost = await Post.insert({
      user_id: user.id,
      ...mockPost2,
    });
    const resp = await agent.get('/api/v1/posts/user/1');
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual([userPost]);
  });

  //* PUT route test
  // test for user updating information
  // create a post -> edit the post
  // expect the new post body
  test('PUT /api/v1/posts/:id', async () => {
    const [agent, user] = await registerAndLogin();
    const oldPost = await Post.insert({ ...mockPost2, user_id: user.id });
    const resp = await agent
      .put(`/api/v1/posts/${oldPost.id}`)
      .send({ rating: 3 });
    expect(resp.status).toBe(200);
    expect(resp.body).toEqual({
      ...mockPost2,
      rating: '3',
      user_id: user.id,
      id: expect.any(String),
    });
  });
});
