const { REST, Routes } = require("discord.js");
const config = require("../config/config");

module.exports = async (client) => {
    const rest = new REST({ version: '10' }).setToken(process.env.CLIENT_TOKEN || config.token);

    try {
        client.log('Started loading application commands... (this might take minutes!)');

        await rest.put(Routes.applicationCommands(config.clientID), {
            body: client.applicationcommandsArray
        });

        client.log('Successfully loaded application commands to Discord API.');
    } catch (e) {
        client.error('Unable to load application commands to Discord API.');
    };
};