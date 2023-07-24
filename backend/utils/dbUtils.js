const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://stela:stelarosa@spotifypenn.kfju1o3.mongodb.net/test';
let mongoConnection;
const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const connect = async () => {
  try {
    mongoConnection = await mongoClient.connect();
    return mongoConnection;
  } catch (err) {
    return err;
  }
};

const getDB = async () => {
  if (!mongoConnection) {
    await connect();
  }
  return mongoConnection.db('spotify');
};

const closeMongoDBConnection = async () => {
  await mongoConnection.close();
};

module.exports = { connect, getDB, closeMongoDBConnection };
