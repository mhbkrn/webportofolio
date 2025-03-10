# MongoDB Atlas Setup Guide

This guide explains how to set up your portfolio application with MongoDB Atlas.

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account
2. Create a new organization if prompted, or use an existing one

## Step 2: Create a Cluster

1. Create a new project if needed
2. Click "Build a Database"
3. Choose the FREE tier (M0) option
4. Select your preferred provider (AWS, Google Cloud, or Azure) and region (choose one close to your target audience)
5. Name your cluster (e.g., "portfolio-cluster")
6. Click "Create Cluster"

## Step 3: Set up Database Access

1. Once your cluster is created, click on "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Select "Password" authentication
4. Enter a username and password (save these securely)
5. For user privileges, select "Read and write to any database"
6. Click "Add User"

## Step 4: Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development, you can choose "Allow Access from Anywhere" (0.0.0.0/0)
4. For production, add only the specific IP addresses that need access
5. Add a description like "Development" or "Production Server"
6. Click "Confirm"

## Step 5: Get Your Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string

## Step 6: Configure Your Application

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Replace the placeholder in MONGODB_URI with your connection string:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
```
3. Replace `<username>` and `<password>` with your database user credentials
4. Replace `<dbname>` with "portfolio" or your preferred database name
5. Set the DB_NAME variable to match the database name in your connection string

## Step 7: Test Your Connection

Run the connection test script:

```
node utils/testConnection.js
```

If successful, you'll see a list of available collections or a message that the database is new.

## Step 8: Initialize Admin User

To set up your admin credentials:

1. Run the password generator script:
```
node utils/generatePassword.js
```

2. Enter a secure password when prompted
3. Add the generated ADMIN_USERNAME and ADMIN_PASSWORD values to your `.env` file

## Troubleshooting

If you can't connect:

1. Verify your username and password are correct
2. Check if your IP address is in the allowed list in Network Access
3. Ensure you've properly URL-encoded special characters in your password
4. Try connecting from a different network

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver Documentation](https://docs.mongodb.com/drivers/node/)
- [MongoDB Atlas Connection Troubleshooting](https://docs.atlas.mongodb.com/troubleshoot-connection/)