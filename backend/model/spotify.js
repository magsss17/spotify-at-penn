const { getDB } = require('../utils/dbUtils');

const setUserSongs = async (id, newSongs) => {
  const db = await getDB();
  const result = await db.collection('users').updateOne(
    { _id: id },
    { $set: { songs: newSongs } },
  );
  if (result.matchedCount === 0) {
    throw new Error(`User with ID ${id} not found`);
  }
  return result;
};

const setUserAlbums = async (id, newArtists) => {
  const db = await getDB();
  const result = await db.collection('users').updateOne(
    { _id: id },
    { $set: { artists: newArtists } },
  );
  if (result.matchedCount === 0) {
    throw new Error(`User with ID ${id} not found`);
  }
  return result;
};

module.exports = {
  setUserSongs,
  setUserAlbums,
};
