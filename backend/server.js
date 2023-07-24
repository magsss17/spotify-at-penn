/* eslint-disable no-underscore-dangle */
const express = require('express');

const fs = require('fs');

const formidable = require('formidable');

// import the cors -cross origin resource sharing- module
const cors = require('cors');
const s3 = require('./s3Operations');

// create a new express app
const webapp = express();

// enable cors
webapp.use(cors());

// enable json body parsing
webapp.use(express.json());

// configure express to parse request bodies
webapp.use(express.urlencoded({ extended: true }));

// import the db functions
const dbChat = require('./model/chat');
const dbCommunities = require('./model/communities');
const dbNewArtist = require('./model/newArtist');
const dbPlaylists = require('./model/playlists');
const dbUsers = require('./model/users');
const dbSpotify = require('./model/spotify');
// const { default: CommunitiesTable } = require('../client/src/components/CommunitiesTable');

// root endpoint route
webapp.get('/', (req, resp) => {
  resp.json({ message: 'This is spotify at Penn' });
});

webapp.get('/users', async (req, resp) => {
  try {
    // get the data from the DB
    const users = await dbUsers.getUsers();
    resp.status(200).json(users);
    // send response
  } catch (err) {
    resp.status(400).json({ message: 'There was an error' });
  }
});

webapp.post('/users', async (req, res) => {
  try {
    const userData = req.body;
    const result = await dbUsers.addUser(userData);
    res.status(201).json({ message: 'User added successfully', data: result });
  } catch (err) {
    res.status(400).json({ message: 'Error adding user', error: err });
  }
});

webapp.get('/other-users', async (req, res) => {
  try {
    const users = await dbUsers.getUsers(req.headers.authorization);
    if (users === undefined) {
      res.status(404).json({ error: 'no users exist' });
      return;
    }

    // remove current user
    if (req.headers.authorization) {
      const filteredUsers = users.filter((user) => user._id !== req.headers.authorization);
      res.status(200).json(filteredUsers);
    } else { // if no authorization header, return all users
      res.status(200).json(users);
    }
  } catch (err) {
    res.status(400).json({ message: 'Error retrieving users', error: err });
  }
});

webapp.post('/other-users/follow/:id', async (req, res) => {
  try {
    const result = await dbUsers.toggleFollow(req.headers.authorization, req.params.id);
    // const id = req.params.id;
    // const user = await dbUsers.getUser(id);
    if (result === undefined) {
      res.status(404).json({ error: 'user not found' });
      return;
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: 'error in following user', error: err });
  }
});

webapp.get('/communities', async (req, res) => {
  try {
    const results = await dbCommunities.getCommunities(req.headers.authorization);
    if (results === undefined) {
      res.status(404).json({ error: 'no communities exist' });
      return;
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(400).json({ message: 'error in retrieving communities' });
  }
});

webapp.post('/communities', async (req, res) => {
  try {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(404).json({ error: err.message });
      }
      let cacheBuffer = Buffer.alloc(0);

      // create a stream from the virtual path of the uploaded file
      const fStream = fs.createReadStream(files.File_0.filepath);

      fStream.on('data', (chunk) => {
        // fill the buffer with data from the uploaded file
        cacheBuffer = Buffer.concat([cacheBuffer, chunk]);
      });

      fStream.on('end', async () => {
        // send buffer to AWS
        const s3URL = await s3.uploadFile(cacheBuffer, files.File_0.newFilename);

        const newCommunity = {
          name: fields.name,
          image: s3URL,
          description: fields.desc,
          members: [req.headers.authorization],
        };

        const result = await dbCommunities.addCommunity(newCommunity);
        res.status(201).json({ data: { id: result } });
      });
    });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

webapp.get('/newartistplaylists', async (req, res) => {
  try {
    const results = await dbNewArtist.getNewArtistPlaylists(req.headers.authorization);
    if (results === undefined) {
      res.status(404).json({ error: 'no new artists' });
      return;
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(404).json({ message: 'there was an error' });
  }
});

webapp.post('/newartistplaylists', async (req, res) => {
  const {
    artistName, email, spotifyURL, playlistName, description,
  } = req.body;

  if (!artistName || !email || !spotifyURL || !playlistName || !description) {
    res.status(400).json({ message: 'missing info' });
    return;
  }

  try {
    const results = await dbNewArtist.postNewArtistPlaylist(
      artistName,
      email,
      spotifyURL,
      playlistName,
      description,
    );
    res.status(201).json(results);
  } catch (err) {
    res.status(409).json({ message: 'error', error: err });
  }
});

webapp.post('/newartistplaylists/:_id', async (req, res) => {
  try {
    const results = await dbNewArtist.toggleNewArtistLikes(
      req.params.id,
      req.headers.authorization,
    );
    if (results === undefined) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'server error' });
  }
});

webapp.get('/playlists', async (req, res) => {
  try {
    // get the data from the db
    const results = await dbPlaylists.getPlaylists();
    if (results === undefined) {
      res.status(404).json({ error: 'No Playlists found' });
      return;
    }
    // send the response with the appropriate status code
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'there was a server error' });
  }
});

webapp.post('/playlists', async (req, res) => {
  const {
    id, name, desc,
  } = req.body;

  if (!id || !name || !desc) {
    res.status(400).json({ message: 'missing info' });
    return;
  }

  try {
    const results = await dbPlaylists.postPlaylists(id, name, desc);
    res.status(201).json(results);
  } catch (err) {
    res.status(409).json({ message: 'error', error: err });
  }
});

webapp.post('/playlists/like/:id', async (req, res) => {
  try {
    const results = await dbPlaylists.toggleLikePlaylist(req.params.id, req.headers.authorization);
    if (results === undefined) {
      res.status(404).json({ error: 'Playlist not found' });
      return;
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'server error' });
  }
});

webapp.get('/users/:id', async (req, res) => {
  try {
    // get the data from the db
    const results = await dbUsers.getUser(req.params.id);

    if (results === null) {
      res.status(404).json({ error: 'unknown student' });
    } else {
      res.status(200).json(results);
    }
  } catch (err) {
    const errmsg = err.message;

    res.status(404).json({ message: errmsg });
  }
});

webapp.put('/users/:id', async (req, res) => {
  try {
    const results = await dbUsers.updateUser(req.params.id);
    if (results === undefined) {
      res.status(404).json({ error: 'unknown user' });
    } else {
      res.status(200).json(results);
    }
  } catch (err) {
    const errmsg = err.message;

    res.status(404).json({ message: errmsg });
  }
});

webapp.put('/sockets/:socket', async (req, res) => {
  try {
    const socketId = parseInt(req.params.socket, 10);
    const document = req.body;
    const result = await dbChat.updateMessages(socketId, document);
    if (result === undefined) {
      res.status(404).json({ error: 'unknown socket' });
    } else {
      res.status(200).json(result);
    }
  } catch (err) {
    const errmsg = err.message;

    res.status(404).json({ message: errmsg });
  }
});

webapp.get('/sockets/:socket', async (req, res) => {
  try {
    // get the data from the db
    const socketId = parseInt(req.params.socket, 10);
    const results = await dbChat.getMessages(socketId);
    if (results === undefined) {
      res.status(404).json({ error: 'unknown socket' });
    } else {
      res.status(200).json(results);
    }
  } catch (err) {
    const errmsg = err.message;

    res.status(404).json({ message: errmsg });
  }
});

webapp.get('/sockets', async (req, res) => {
  try {
    // get the data from the db
    const results = await dbChat.getSockets();
    if (results === undefined) {
      res.status(404).json({ error: 'unknown socket' });
    } else {
      res.status(200).json(results);
    }
  } catch (err) {
    const errmsg = err.message;

    res.status(404).json({ message: errmsg });
  }
});

webapp.post('/sockets', async (req, res) => {
  try {
    const document = req.body;

    const result = await dbChat.newConversation(document);
    if (result === undefined) {
      res.status(404).json({ error: 'unknown socket' });
    } else {
      res.status(201).json(result);
    }
  } catch (err) {
    const errmsg = err.message;

    res.status(404).json({ message: errmsg });
  }
});

webapp.put('/songs/:id', async (req, res) => {
  try {
    const { songs } = req.body;
    const results = await dbSpotify.setUserSongs(req.params.id, songs);
    if (results === undefined) {
      res.status(404).json({ error: 'unknown song' });
    } else {
      res.status(200).json(results);
    }
  } catch (err) {
    const errmsg = err.message;

    res.status(404).json({ message: errmsg });
  }
});

webapp.put('/artists/:id', async (req, res) => {
  try {
    const { artists } = req.body;
    const results = await dbSpotify.setUserAlbums(req.params.id, artists);
    if (results === undefined) {
      res.status(404).json({ error: 'unknown album' });
    } else {
      res.status(200).json(results);
    }
  } catch (err) {
    const errmsg = err.message;

    res.status(404).json({ message: errmsg });
  }
});

webapp.get('/songs', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.page_size, 10) || 10000000000;
  try {
    const results = await dbUsers.getRankedSongs(page, pageSize);
    if (results === null) {
      res.status(404).json({ error: 'unknown song' });
    } else {
      res.status(200).json(results);
    }
  } catch (err) {
    res.status(500).json({ message: 'server error' });
  }
});

webapp.get('/users/playlists/:id', async (req, res) => {
  try {
    const results = await dbUsers.getPlaylists(req.params.id);
    if (results === undefined) {
      res.status(404).json({ error: 'results undefined' });
      return;
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'server error' });
  }
});

webapp.post('/users/playlists/:id', async (req, res) => {
  const {
    playlistid, name, desc,
  } = req.body;
  const { id } = req.params;

  if (!playlistid || !name || !desc) {
    res.status(400).json({ message: 'missing info' });
    return;
  }

  try {
    const results = await dbUsers.postPlaylists(id, playlistid, name, desc);
    res.status(201).json(results);
  } catch (err) {
    res.status(409).json({ message: 'error', error: err });
  }
});

webapp.get('/users/friends/:id', async (req, res) => {
  try {
    const results = await dbUsers.getFriends(req.params.id);
    if (results === undefined) {
      res.status(404).json({ error: 'results undefined' });
      return;
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'server error' });
  }
});

webapp.get('/users/communities/:id', async (req, res) => {
  try {
    const results = await dbUsers.getCommmunities(req.params.id);
    if (results === undefined) {
      res.status(404).json({ error: 'results undefined' });
      return;
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: 'server error' });
  }
});

webapp.get('/artists', async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const pageSize = parseInt(req.query.page_size, 10) || 10000000000;
  try {
    const results = await dbUsers.getRankedArtists(page, pageSize);
    if (results === null) {
      res.status(404).json({ error: 'unknown artist' });
    } else {
      res.status(200).json(results);
    }
  } catch (err) {
    res.status(500).json({ message: 'server error' });
  }
});

webapp.get('/communities/members/:id', async (req, res) => {
  try {
    const communityId = req.params.id;
    const userId = req.headers.authorization;

    const results = await dbCommunities.toggleMembership(userId, communityId);
    if (results === null) {
      res.status(404).json({ error: 'unknown community' });
    } else {
      res.status(200).json(results);
    }
  } catch (err) {
    res.status(500).json({ message: 'server error' });
  }
});

module.exports = webapp;
