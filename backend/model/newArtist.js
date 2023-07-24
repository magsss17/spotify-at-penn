/* eslint-disable no-underscore-dangle */
const { getDB } = require('../utils/dbUtils');
const { toggleLikeObject, checkLikeObject } = require('../utils/toggleLikeUtil');

async function postNewArtistPlaylist(name, email, spotifyURL, playlistName, description) {
  const db = await getDB();
  const result = await db.collection('newArtists').insertOne({
    artistName: name,
    email,
    spotifyURL,
    playlistName,
    description,
    likes: false,
    userLikes: [email],
  });
  return result.insertedId;
}

async function getNewArtistPlaylists(userId) {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection('newArtists').find({}).toArray();

    // add like true/false to each playlist object
    for (let i = 0; i < result.length; i += 1) {
      const newArtist = result[i];
      if (checkLikeObject(newArtist, userId)) {
        newArtist.likes = true;
      } else {
        newArtist.likes = false;
      }
    }

    return result;
  } catch (err) {
    return err;
  }
}

async function toggleNewArtistLikes(itemId, userId) {
  return toggleLikeObject(itemId, userId, 'newArtists');
}

module.exports = {
  getNewArtistPlaylists,
  postNewArtistPlaylist,
  toggleNewArtistLikes,
};
