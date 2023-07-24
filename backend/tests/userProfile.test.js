const request = require('supertest');
const app = require('../server');

describe('GET user playlists integration test', () => {
  test('the status code is 200 and response type', async () => {
    const response = await request(app).get('/users/playlists/admin@gmail.com').set('Authorization', 'admin@upenn.edu');
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
  });
});

describe('GET user friends integration test', () => {
  test('the status code is 200 and response type', async () => {
    const response = await request(app).get('/users/friends/admin@gmail.com').set('Authorization', 'admin@upenn.edu');
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
  });
});

describe('GET user communities integration test', () => {
  test('the status code is 200 and response type', async () => {
    const response = await request(app).get('/users/communities/admin@gmail.com').set('Authorization', 'admin@upenn.edu');
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
  });
});
