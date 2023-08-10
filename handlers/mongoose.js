// Import the 'connect' function from the mongoose module
const { connect } = require("mongoose");
// Import the configuration from the config file
const config = require("../config/config");

// Export an asynchronous function that connects the bot to MongoDB
module.exports =  async (client) => {
    // Check if MongoDB connection is enabled in the configuration
    if (config.mongodb.toggle) {
        // Log a warning that the bot is starting to connect to MongoDB
        client.warn('Started connecting to MongoDB...');

        // Attempt to connect to MongoDB using the provided URI or configuration URI
        await connect(process.env.MONGODB_URI || config.mongodb.uri).then(() => {
            // If the connection is successful, log that MongoDB is connected
            client.log('MongoDB is connected to the atlas!')
        });
    } else {
        // If MongoDB connection is disabled in the config, log a warning
        client.warn('MongoDB has been disabled in the config file!');
    }
};