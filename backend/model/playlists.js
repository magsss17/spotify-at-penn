const { getDB } = require('../utils/dbUtils');
const { toggleLikeObject, checkLikeObject, checkLikeObjectFromDB } = require('../utils/toggleLikeUtil');

const getPlaylists = async (userId) => {
  // get the db
  const db = await getDB();
  const playlists = await db.collection('playlists').find({}).toArray();

  // add like true/false to each playlist object
  for (let i = 0; i < playlists.length; i += 1) {
    const playlist = playlists[i];
    if (checkLikeObject(playlist, userId)) {
      playlist.likes = true;
    } else {
      playlist.likes = false;
    }
  }

  return playlists;
};

const postPlaylists = async (id, name, desc) => {
  const db = await getDB();
  const result = await db.collection('playlists').insertOne({
    id,
    name,
    description: desc,
    image: 'https://st2.depositphotos.com/33190558/47628/i/450/depositphotos_476287700-stock-photo-purple-solid-color-background-plain.jpg',
    likes: false,
  });
  return result.insertedId;
};

const toggleLikePlaylist = async (playlistId, userId) => toggleLikeObject(playlistId, userId, 'playlists');

const checkLikePlaylist = async (playlistId, userId) => checkLikeObjectFromDB(playlistId, userId, 'playlists');

module.exports = {
  getPlaylists,
  postPlaylists,
  toggleLikePlaylist,
  checkLikePlaylist,
};
