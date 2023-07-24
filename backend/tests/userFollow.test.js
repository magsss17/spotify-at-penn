const request = require('supertest');
const app = require('../server');

describe('GET /', () => {
  it('should respond with a message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('This is spotify at Penn');
  });
});

describe('GET /users', () => {
  it('should respond with an array of users', async () => {
    const response = await request(app).get('/users').set('Authorization', 'admin@gmail.com');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toMatchObject({
      _id: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      password: expect.any(String),
      new: expect.any(Boolean),
      songs: expect.any(Array),
      artists: expect.any(Array),
      communities: expect.any(Array),
      friends: expect.any(Array),
      playlists: expect.any(Array),
      following: expect.any(Array),
    });
  });
});

describe('GET /other-users', () => {
  it('should respond with an array of other users', async () => {
    const response = await request(app).get('/other-users').set('Authorization', 'admin@gmail.com');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toMatchObject({
      _id: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      password: expect.any(String),
      new: expect.any(Boolean),
      songs: expect.any(Array),
      artists: expect.any(Array),
      communities: expect.any(Array),
      friends: expect.any(Array),
      playlists: expect.any(Array),
      following: expect.any(Array),
    });
  });
});

describe('POST /other-users/follow/:id', () => {
  it('should respond with a success message when following a user', async () => {
    const userId = 'admin@upenn.edu';
    const response = await request(app).post(`/other-users/follow/${userId}`).set('Authorization', 'admin@gmail.com');
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      following: expect.any(Boolean),
    });
  });

  it('should respond with an error message when trying to follow a non-existent user', async () => {
    const userId = 'hey';
    const response = await request(app).post(`/other-users/follow/${userId}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('user not found');
  });
});
