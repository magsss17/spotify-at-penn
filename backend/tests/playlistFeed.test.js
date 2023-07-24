const request = require('supertest');
const app = require('../server');

describe('GET /playlists', () => {
  it('should respond with an array of playlists', async () => {
    const response = await request(app).get('/playlists').set('Authorization', 'admin@gmail.com');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      desc: expect.any(String),
      image: expect.any(String),
      user_likes: expect.any(Array),
      likes: expect.any(Boolean),
    });
  });
});

describe('POST /playlists/like/:id', () => {
  it('should respond with a success message when liking a playlist', async () => {
    const playlistId = '1'; // Replace with a valid user ID
    const response = await request(app).post(`/playlists/like/${playlistId}`).set('Authorization', 'admin@gmail.com');
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      likes: expect.any(Boolean),
    });

    // toggle back

    const response2 = await request(app).post(`/playlists/like/${playlistId}`).set('Authorization', 'admin@gmail.com');
    expect(response2.statusCode).toBe(200);
    expect(response2.body).toMatchObject({
      likes: !response.body.likes,
    });
  });

  it('should respond with an error message when trying to like a non-existent playlist', async () => {
    const playlistId = 'nonexistent';
    const response = await request(app).post(`/playlists/like/${playlistId}`).set('Authorization', 'admin@gmail.com');
    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Playlist not found');
  });
});
