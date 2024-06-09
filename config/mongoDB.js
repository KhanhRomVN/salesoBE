const { MongoClient, ServerApiVersion } = require('mongodb');

let databaseInstance = null;

const mongoClientInstance = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const connectDB = async () => {
  try {
    await mongoClientInstance.connect();
    databaseInstance = mongoClientInstance.db(process.env.DATABASE_NAME);
    console.log("Successfully connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1); // Exit process with failure
  }
};

const getDB = () => {
  if (!databaseInstance) {
    throw new Error('Must connect to database first');
  }
  return databaseInstance;
};

module.exports = { connectDB, getDB };
