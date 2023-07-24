const mongoose = require('mongoose');
const { getDB } = require('../utils/dbUtils');

const { ObjectId } = mongoose.Types;

/** get all the communities */
const getCommunities = async (userId) => {
  const db = await getDB();
  const result = await db.collection('communities').find({}).toArray();

  if (userId) {
    for (let i = 0; i < result.length; i += 1) {
      const community = result[i];
      if (community.members && community.members.includes(userId)) {
        community.member = true;
      } else {
        community.member = false;
      }
    }
  }

  for (let i = 0; i < result.length; i += 1) {
    const community = result[i];
    if (community.members) {
      community.numMember = community.members.length;
    } else {
      community.numMember = 0;
    }
  }

  return result;
};

const addCommunity = async (newCommunity) => {
  const db = await getDB();
  const result = await db.collection('communities').insertOne(newCommunity);
  return result.insertedId;
};

const toggleMembership = async (userId, communityId) => {
  const db = await getDB();
  const cID = new ObjectId(communityId);
  const community = await db.collection('communities').findOne({ _id: cID });
  if (!community) {
    return community;
  }

  // check if user_likes exists
  if (!community.members) {
    await db.collection('communities').updateOne({ _id: cID }, { $set: { members: [userId] } });
    return { member: true };
  } if (community.members.includes(userId)) {
    await db.collection('communities').updateOne({ _id: cID }, { $pull: { members: userId } });
    return { member: false };
  }
  await db.collection('communities').updateOne({ _id: cID }, { $push: { members: userId } });
  return { member: true };
};

module.exports = {
  getCommunities,
  addCommunity,
  toggleMembership,
};
