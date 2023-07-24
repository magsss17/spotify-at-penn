const { getDB, closeMongoDBConnection } = require('../utils/dbUtils');

const newConversation = async (document) => {
  const db = await getDB();
  const result = await db.collection('sockets').insertOne(document);
  return result.insertedId;
};

const getMessages = async (socket) => {
  const db = await getDB();
  const result = await db.collection('sockets').findOne({ _id: socket });
  return result;
};

const getSockets = async () => {
  try {
    const db = await getDB();
    const sockets = await db.collection('sockets').find({}).toArray();
    return sockets;
  } finally {
    await closeMongoDBConnection();
  }
};

const updateMessages = async (socket, updatedSocket) => {
  const db = await getDB();
  const result = await db.collection('sockets').updateOne(
    { _id: socket },
    { $set: { messages: updatedSocket.messages } },
  );
  return result;
};

module.exports = {
  newConversation,
  getMessages,
  getSockets,
  updateMessages,
};
