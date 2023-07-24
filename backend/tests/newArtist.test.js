/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const { connect, closeMongoDBConnection } = require('../utils/dbUtils');
const {
  deleteTestDataFromNewArtistsDB, insertTestDataToNewArtistsDB, testNewArtist,
} = require('../utils/testUtils');

const webapp = require('../server');

let mongo;

// test POST newArtists endpoint
describe('POST newArtists endpoint tests', () => {
  let db;
  let response;

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();

    response = await request(webapp).post('/newartistplaylists')
      .send('artistName=TestArtist&email=test@example.com&spotifyURL=testtest&playlistName=TestPlaylist&description=TestDescription');
  });

  afterAll(async () => {
    try {
      await deleteTestDataFromNewArtistsDB(db, 'TestArtist');
      await mongo.close();
      await closeMongoDBConnection();
      return null;
    } catch (err) {
      return err;
    }
  });

  test('The status code is 201 and response type', () => {
    expect(response.status).toBe(201);
    expect(response.type).toBe('application/json');
  });

  test('The new artist playlist is in the returned data', () => {
    expect(JSON.parse(response.text)).not.toBe(undefined);
  });

  test('The new artist playlist is in the database', async () => {
    const insertedPlaylist = await db.collection('newArtists').findOne({ artistName: 'TestArtist' });
    expect(insertedPlaylist.artistName).toEqual('TestArtist');
  });

  test('Missing a field (email) 400', async () => {
    const res = await request(webapp).post('/newartistplaylists')
      .send('artistName=TestArtist&spotifyURLrl=testtest&playlistName=TestPlaylist&description=TestDescription');
    expect(res.status).toEqual(400);
  });
});

// test GET newArtists endpoint
describe('GET newArtists endpoint integration test', () => {
  let db;

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();

    await insertTestDataToNewArtistsDB(db, testNewArtist);
  });

  /**
 * Delete all test data from the DB
 * Close all open connections
 */
  afterAll(async () => {
    await deleteTestDataFromNewArtistsDB(db, 'teststudent');
    try {
      await mongo.close();
      await closeMongoDBConnection();
      return null;
    } catch (err) {
      return err;
    }
  });

  test('Get all new artists endpoint status code and data', async () => {
    const resp = await request(webapp).get('/newartistplaylists');
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const testArtists = await db.collection('newArtists').find({ artistName: 'TestArtist' }).toArray();
    expect(testArtists.length >= 1).toBe(true);
  });

  test('new artist not in db status code 404', async () => {
    const resp = await request(webapp).get('/newartistplaylists/1').set('Authorization', 'admin@gmail.com');
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('text/html');
  });
});
