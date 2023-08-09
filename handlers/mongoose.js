
const { connect } = require("mongoose");
const config = require("../config/config");

module.exports =  async (client) => {
    if (config.mongodb.toggle) {
        client.warn('Started connecting to MongoDB...');
        
        await connect(process.env.MONGODB_URI || config.mongodb.uri).then(() => {
            client.log('MongoDB is connected to the atlas!')
        });
    } else {
        client.warn('MongoDB has been disabled in the config file!');
    }
};