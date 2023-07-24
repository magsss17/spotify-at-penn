const request = require('supertest');
const app = require('../server');

describe('GET songs test', () => {
  test('the status code is 200 and response type', async () => {
    const response = await request(app).get('/songs');
    expect(response.status).toBe(200); // status code
    expect(response.type).toBe('application/json');
  });
});

describe('GET artists test', () => {
  test('the status code is 200 and response type', async () => {
    const response = await request(app).get('/artists');
    expect(response.status).toBe(200); // status code
    expect(response.type).toBe('application/json');
  });
});
