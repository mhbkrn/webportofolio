const { MongoClient } = require('mongodb');

// Use MongoDB Atlas connection string format
// Format: mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'portfolio';

let db = null;
let client = null;

/**
 * Connect to MongoDB Atlas
 * @returns {Promise<Db>} MongoDB database instance
 */
async function connectDB() {
  try {
    // MongoDB connection options for better reliability
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 60000,
    };

    client = await MongoClient.connect(uri, options);
    db = client.db(dbName);
    console.log(`Connected to MongoDB database: ${dbName} successfully`);
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

/**
 * Get the MongoDB database instance
 * @returns {Db} MongoDB database instance
 */
function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB() first');
  }
  return db;
}

/**
 * Close the MongoDB connection
 */
async function closeDB() {
  try {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}

// Handle application shutdown gracefully
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

module.exports = {
  connectDB,
  getDB,
  closeDB
};