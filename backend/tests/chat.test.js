const request = require('supertest');
const webapp = require('../server');

describe('GET /sockets', () => {
  it('should respond with a list of sockets', async () => {
    const response = await request(webapp).get('/sockets');
    expect(response.statusCode).toBe(200);
  });
});

describe('POST /sockets', () => {
  it('should respond with a success message when creating a new conversation', async () => {
    const document = { /* your conversation document structure */ };
    const response = await request(webapp).post('/sockets').send(document);
    expect(response.statusCode).toBe(201);
  });
});
