// Import required modules
const { REST, Routes } = require("discord.js");
const config = require("../config/config");

// Export an async function to load application commands into the Discord API
module.exports = async (client) => {
    // Create a REST client instance and set the token
    const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN || config.token);

    try {
        // Log that the process of loading application commands has started
        client.log('Started loading application commands... (this might take minutes!)');

        // Send a PUT request to update application commands using Discord API
        await rest.put(Routes.applicationCommands(config.clientID), {
            body: client.applicationcommandsArray
        });

        // Log a success message after application commands are loaded
        client.log('Successfully loaded application commands to Discord API.');
    } catch (e) {
        // Log an error message if there's an issue loading application commands
        client.error('Unable to load application commands to Discord API.');
    };
};