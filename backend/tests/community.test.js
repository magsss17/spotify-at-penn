const request = require('supertest');
const app = require('../server');

describe('GET communities integration test', () => {
  test('the status code is 200 and response type', async () => {
    const response = await request(app).get('/communities').set('Authorization', 'admin@upenn.edu');
    expect(response.status).toBe(200); // status code
    expect(response.type).toBe('application/json');
  });
});

describe('GET communities members', () => {
  test('Invalid ID = the status code is 500 and unknown community message', async () => {
    const variable = 'invalidID';
    const response = await request(app).get(`/communities/members/${variable}`).set('Authorization', 'admin@upenn.edu');
    expect(response.status).toBe(500); // status code
  });

  test('Nonexistent ID = the status code is 404 and unknown community message', async () => {
    const variable = '54201d4c2a5ec69d98ec63d4';
    const response = await request(app).get(`/communities/members/${variable}`).set('Authorization', 'admin@upenn.edu');
    expect(response.status).toBe(404); // status code
  });

  test('correct = the status code is 200', async () => {
    const variable = '64404d4c2a5ec69d98eb63d4';
    const response = await request(app).get(`/communities/members/${variable}`).set('Authorization', 'admin@upenn.edu');
    expect(response.status).toBe(200); // status code

    // toggle back
    const response2 = await request(app).get(`/communities/members/${variable}`).set('Authorization', 'admin@upenn.edu');
    expect(response2.status).toBe(200); // status code
  });
});
