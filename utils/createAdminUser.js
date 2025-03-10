require('dotenv').config();
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdminUser() {
  // Get MongoDB connection details from environment variables
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.DB_NAME || 'portfolio';
  
  console.log('MongoDB Admin User Creation Utility');
  console.log('----------------------------------');
  
  // Get admin details from user input
  const username = await askQuestion('Enter admin username: ');
  const password = await askQuestion('Enter admin password: ');
  const email = await askQuestion('Enter admin email (optional): ');
  const fullName = await askQuestion('Enter admin full name (optional): ');
  
  let client;
  try {
    // Connect to MongoDB
    console.log('\nConnecting to MongoDB...');
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000
    };
    
    client = await MongoClient.connect(uri, options);
    const db = client.db(dbName);
    
    // Check if admins collection exists, if not create it
    const collections = await db.listCollections({ name: 'admins' }).toArray();
    if (collections.length === 0) {
      console.log('Creating admins collection...');
      await db.createCollection('admins');
      
      // Create an index on username for faster lookups and to enforce uniqueness
      await db.collection('admins').createIndex({ username: 1 }, { unique: true });
    }
    
    // Check if admin already exists
    const existingAdmin = await db.collection('admins').findOne({ username });
    if (existingAdmin) {
      console.error(`\n❌ Admin with username "${username}" already exists.`);
      return;
    }
    
    // Hash the password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create admin user document
    const adminUser = {
      username,
      password: hashedPassword,
      email: email || null,
      fullName: fullName || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    };
    
    // Insert admin into database
    await db.collection('admins').insertOne(adminUser);
    
    console.log(`\n✅ Admin user "${username}" created successfully!`);
    
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    if (client) {
      await client.close();
      console.log('Database connection closed.');
    }
    rl.close();
  }
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Run the script
createAdminUser().catch(console.error);