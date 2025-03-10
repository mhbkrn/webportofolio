const bcrypt = require('bcrypt');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter password to hash: ', async (password) => {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('\nHashed password:');
    console.log(hashedPassword);
    console.log('\nAdd the following to your .env file:');
    console.log(`ADMIN_USERNAME=admin`);
    console.log(`ADMIN_PASSWORD=${hashedPassword}`);
  } catch (error) {
    console.error('Error hashing password:', error);
  } finally {
    rl.close();
  }
});