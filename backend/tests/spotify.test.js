const request = require('supertest');
const webapp = require('../server');

describe('PUT /songs/:id', () => {
  it('should respond with a success message when updating user songs', async () => {
    const userId = 'admin@gmail.com';
    const response = await request(webapp).put(`/songs/${userId}`).send({ songs: [] });
    expect(response.statusCode).toBe(200);
  });

  it('should respond with an error message when trying to update songs for a non-existent user', async () => {
    const userId = 'nonexistent@example.com';
    const response = await request(webapp).put(`/songs/${userId}`).send({ songs: [] });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toContain('User with ID');
  });
});

describe('PUT /artists/:id', () => {
  it('should respond with a success message when updating user artists', async () => {
    const userId = 'admin@gmail.com';
    const response = await request(webapp).put(`/artists/${userId}`).send({ artists: [] });
    expect(response.statusCode).toBe(200);
  });

  it('should respond with an error message when trying to update artists for a non-existent user', async () => {
    const userId = 'nonexistent@example.com';
    const response = await request(webapp).put(`/artists/${userId}`).send({ artists: [] });
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toContain('User with ID');
  });
});
