// Register module alias if necessary
require('module-alias/register');

const mongoose = require('mongoose');
const { globSync } = require('glob');
const path = require('path');

// Ensure Node.js version is 7.6+ (though Node.js versions are typically different, e.g., 14.x.x, 16.x.x)
const [major, minor] = process.versions.node.split('.').map(parseFloat);
if (major < 20) {
  console.log('Please upgrade your Node.js version to at least 20 or greater. 👌\n');
  process.exit();
}

// Import environmental variables from .env and .env.local files
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

// Connect to MongoDB using environment variable
mongoose.connect(process.env.DATABASE);

// Optional: Accessing other environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Handle MongoDB connection errors
mongoose.connection.on('error', (error) => {
  console.log('Error connecting to MongoDB. Check your .env file and MongoDB URL.');
  console.error(`MongoDB Error: ${error.message}`);
});

// Load all model files synchronously using glob
const modelsFiles = globSync('./src/models/**/*.js');
for (const filePath of modelsFiles) {
  require(path.resolve(filePath));
}

// Start your Express app!
const app = require('./app'); // Assuming app.js or main entry file is in the current directory
app.set('port', process.env.PORT || 8888);
const server = app.listen(app.get('port'), () => {
  console.log(`Express server running on PORT : ${server.address().port}`);
});
