require('dotenv').config();
const { MongoClient } = require('mongodb');

// MongoDB Atlas connection test
async function testMongoDBConnection() {
  console.log('Testing MongoDB Atlas connection...');
  
  // Get connection details from environment variables
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;
  
  if (!uri) {
    console.error('ERROR: MONGODB_URI environment variable is not set');
    console.log('Please set up your .env file with the MongoDB Atlas connection string');
    process.exit(1);
  }
  
  console.log(`Using database: ${dbName}`);
  
  let client;
  
  try {
    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    };

    // Connect to MongoDB Atlas
    client = await MongoClient.connect(uri, options);
    console.log('✅ Connected to MongoDB Atlas successfully!');
    
    // Test database access
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    console.log(`\nAvailable collections in ${dbName} database:`);
    
    if (collections.length === 0) {
      console.log('No collections found. This may be a new database.');
    } else {
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });
    }
    
    console.log('\nConnection test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('\nPossible reasons for connection failure:');
    console.log('1. Invalid connection string format');
    console.log('2. Incorrect username or password');
    console.log('3. IP address not whitelisted in MongoDB Atlas');
    console.log('4. Network connectivity issues');
    process.exit(1);
  } finally {
    // Close connection
    if (client) {
      await client.close();
      console.log('Connection closed');
    }
  }
}

// Run the test
testMongoDBConnection().catch(console.error);