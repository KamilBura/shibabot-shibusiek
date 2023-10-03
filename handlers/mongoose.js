// Import the 'connect' function from the mongoose module
const mongoose = require("mongoose");
// Import the configuration from the config file
const config = require("../config/config");
const Logger = require("../module/CommandLog");

mongoose.set("strictQuery", true);

// Export an asynchronous function that connects the bot to MongoDB
module.exports = {
    async loadMongoose() {
        // Check if MongoDB connection is enabled in the configuration
    if (config.mongodb.toggle) {
        // Log a warning that the bot is starting to connect to MongoDB
        Logger.mongoose('Started connecting to MongoDB...');

        // Attempt to connect to MongoDB using the provided URI or configuration URI
        await mongoose.connect(process.env.MONGODB_URI || config.mongodb.uri).then(() => {
            // If the connection is successful, log that MongoDB is connected
            Logger.mongoose('MongoDB is connected!')
        });
    } else {
        // If MongoDB connection is disabled in the config, log a warning
        Logger.warn('MongoDB has been disabled in the config file!');
    }

    },

    schemas: {
        Guild: require("../schemas/Guild"),
        User: require("../schemas/User"),
    },

};