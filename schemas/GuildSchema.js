// Import required modules from mongoose
const { model, Schema } = require('mongoose');

// Export a Mongoose model for 'GuildSchema'
module.exports = model('GuildSchema',
    new Schema({
        // Define a field named 'guild' of type String in the schema
        guild: String,
    })
);