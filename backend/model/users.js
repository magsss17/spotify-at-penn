/* eslint-disable no-underscore-dangle */

const { getDB } = require('../utils/dbUtils');

const checkFollow = (user, followeeId) => user.following && user.following.includes(followeeId);

/* get all the users */
const getUsers = async (userId) => {
  const db = await getDB();
  const users = await db.collection('users').find({}).toArray();

  if (userId) {
    // add following true/false to each playlist object

    const follower = await db.collection('users').findOne({ _id: userId });

    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];
      if (checkFollow(follower, user._id)) {
        user.follows = true;
      } else {
        user.follows = false;
      }
    }
  }
  return users;
};

/* get a user by email */
const getUser = async (email) => {
  const db = await getDB();
  const user = await db.collection('users').findOne({ _id: email });
  return user;
};

/* add a new user */
const addUser = async (newUser) => {
  // get the db
  const db = await getDB();
  const result = await db.collection('users').insertOne(newUser);
  return result.insertedId;
};

const getPassword = async (id) => {
  const db = await getDB();
  const user = await db.collection('users').findOne({ _id: id });
  return user.password;
};

const updateUser = async (id) => {
  const db = await getDB();

  try {
    const result = await db.collection('users').updateOne(
      { _id: id },
      { $set: { new: false } },
    );

    if (result.matchedCount === 0) {
      throw new Error(`User with ID ${id} not found`);
    }
  } catch (error) {
    /* do nothing */
  }
};

async function getRankedSongs(page, pageSize) {
  try {
    const db = await getDB();
    const offset = (page - 1) * pageSize;
    let rankedSongs = await db.collection('users').aggregate([
      { $unwind: '$songs' },
      { $group: { _id: '$songs.id', count: { $sum: 1 }, song: { $first: '$songs' } } },
      { $sort: { count: -1, 'song.songName': 1 } },
      {
        $project: {
          title: '$song.songName',
          album: '$song.albumName',
          count: 1,
        },
      },
      { $skip: offset },
      { $limit: pageSize },

    ]).toArray();

    rankedSongs = rankedSongs.map((song, index) => ({
      ...song,
      rank: offset + index + 1,
    }));

    return rankedSongs;
  } catch (err) {
    return null;
  }
}

const toggleFollow = async (followerId, followeeId) => {
  const db = await getDB();
  // check folowee exists
  const followee = await db.collection('users').findOne({ _id: followeeId });

  if (!followee) {
    return undefined;
  }

  const obj = await db.collection('users').findOne({ _id: followerId });

  if (!obj) {
    return undefined;
  }

  // check if user_likes exists
  if (!obj.following) {
    await db.collection('users').updateOne({ _id: followerId }, { $set: { following: [followeeId] } });
    return { following: true };
  } if (obj.following.includes(followeeId)) {
    await db.collection('users').updateOne({ _id: followerId }, { $pull: { following: followeeId } });
    return { following: false };
  }
  await db.collection('users').updateOne({ _id: followerId }, { $push: { following: followeeId } });
  return { following: true };
};

const getPlaylists = async (id) => {
  const db = await getDB();
  try {
    const userData = await db.collection('users').findOne({ _id: id });
    return userData.playlists;
  } catch (err) {
    return err;
  }
};

const postPlaylists = async (id, playlistid, name, desc) => {
  try {
    const db = await getDB();
    const user = await db.collection('users').findOne({ _id: id });

    if (!user) {
      return null;
    }

    const updatedPlaylists = user.playlists;
    const newPlaylist = {
      playlistid,
      name,
      desc,
      image: 'https://st2.depositphotos.com/33190558/47628/i/450/depositphotos_476287700-stock-photo-purple-solid-color-background-plain.jpg',
    };
    updatedPlaylists.push(newPlaylist);
    const res = await db.collection('users').updateOne(
      { _id: id },
      { $set: { playlists: updatedPlaylists } },
    );

    if (res.matchedCount === 0) {
      return null;
    } if (res.modifiedCount === 0) {
      return null;
    }
    return res.matchedCount;
  } catch (err) {
    return err;
  }
};

const getFriends = async (id) => {
  const db = await getDB();
  try {
    const user = await db.collection('users').findOne({ _id: id });

    if (!user) {
      return null;
    }

    const { friends } = user;
    return friends;
  } catch (err) {
    return err;
  }
};

const getCommmunities = async (id) => {
  const db = await getDB();
  try {
    const user = await db.collection('users').findOne({ _id: id });
    if (!user) {
      return null;
    }

    const { communities } = user;
    return communities;
  } catch (err) {
    return err;
  }
};

async function getRankedArtists(page, pageSize) {
  try {
    const db = await getDB();
    const offset = (page - 1) * pageSize;
    let rankedArtists = await db.collection('users').aggregate([
      { $unwind: '$artists' },
      { $group: { _id: '$artists.artistName', count: { $sum: 1 }, artist: { $first: '$artists' } } },
      { $sort: { count: -1, 'artist.artistName': 1 } },
      {
        $project: {
          artist: '$artist.artistName',
          genre: {
            $reduce: {
              input: '$artist.genres',
              initialValue: '',
              in: {
                $cond: {
                  if: { $eq: ['', '$$value'] },
                  then: '$$this',
                  else: { $concat: ['$$value', ', ', '$$this'] },
                },
              },
            },
          },
          count: 1,
        },
      },
      { $skip: offset },
      { $limit: pageSize },

    ]).toArray();

    rankedArtists = rankedArtists.map((artist, index) => ({
      ...artist,
      rank: offset + index + 1,
    }));

    return rankedArtists;
  } catch (err) {
    return null;
  }
}

module.exports = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  getPassword,
  getRankedSongs,
  getPlaylists,
  postPlaylists,
  getFriends,
  getCommmunities,
  toggleFollow,
  getRankedArtists,
};
