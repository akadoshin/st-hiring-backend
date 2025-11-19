import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017/';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'seetickets';

export const connectMongoDB = (): Db => {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    client.connect();
    db = client.db(MONGODB_DB_NAME);
    console.log('Connected to MongoDB');

    initializeMongoDBIndexes(db);

    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

const initializeMongoDBIndexes = (db: Db): void => {
  try {
    const clientSettingsCollection = db.collection('client_settings');
    clientSettingsCollection.createIndex({ clientId: 1 }, { unique: true });
  } catch (error) {
    console.error('Error initializing MongoDB indexes:', error);
  }
};

export const getMongoDB = (): Db => {
  if (!db) {
    throw new Error('MongoDB not connected. Call connectMongoDB() first.');
  }
  return db;
};

export const closeMongoDB = (): void => {
  if (client) {
    client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
};
