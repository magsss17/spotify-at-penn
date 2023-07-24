const { getDB } = require('./dbUtils');

const toggleLikeObject = async (objId, userId, collection) => {
  const db = await getDB();
  const obj = await db.collection(collection).findOne({ id: objId });

  if (!obj) {
    return undefined;
  }

  // check if user_likes exists
  if (!obj.user_likes) {
    await db.collection(collection).updateOne({ id: objId }, { $set: { user_likes: [userId] } });
    return { likes: true };
  } if (obj.user_likes.includes(userId)) {
    await db.collection(collection).updateOne({ id: objId }, { $pull: { user_likes: userId } });
    return { likes: false };
  }
  await db.collection(collection).updateOne({ id: objId }, { $push: { user_likes: userId } });
  return { likes: true };
};

const checkLikeObject = (obj, userId) => (obj.user_likes && obj.user_likes.includes(userId));

const checkLikeObjectFromDB = async (objId, userId, collection) => {
  const db = await getDB();
  const obj = await db.collection(collection).findOne({ id: objId });

  return (checkLikeObject(obj, userId));
};

module.exports = { toggleLikeObject, checkLikeObject, checkLikeObjectFromDB };
