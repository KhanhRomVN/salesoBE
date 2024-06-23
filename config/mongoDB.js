const { MongoClient, ServerApiVersion } = require('mongodb');
const logger = require('./logger');

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
        logger.info("Successfully connected to the database");
    } catch (error) {
        logger.error("Error connecting to the database", error);
        process.exit(1); // Exit process with failure
    }
};

const getDB = () => {
    if (!databaseInstance) {
        const errorMessage = 'Must connect to database first';
        logger.error(errorMessage);
        throw new Error(errorMessage);
    }
    return databaseInstance;
};

module.exports = { connectDB, getDB };
