const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { log } = require('@functions/consoleLog');
const fs = require('fs');

const deployCommands = async (clientId, guildId, token) => {
    const rest = new REST({ version: '9' }).setToken(token);

/**
    try {
        log('Started deleting existing application (/) commands.', 'rest');

        const deleteRoute = guildId
            ? Routes.applicationGuildCommands(clientId, guildId)
            : Routes.applicationCommands(clientId);

        await rest.delete(deleteRoute);

        log('Successfully deleted existing application (/) commands.', 'rest');
    } catch (error) {
        log('Error deleting existing application (/) commands:', error.message || error, 'error');
    }
 */
    

    const commands = [];
    const commandFiles = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        
        if (command.data) {
            commands.push(command.data);
        }
    }

    try {
        log('Started refreshing application (/) commands.', 'rest');

        const putRoute = guildId
            ? Routes.applicationGuildCommand(clientId, guildId)
            : Routes.applicationCommands(clientId);

            const response = await rest.put(putRoute, { body: commands });
            
        log(`Successfully reloaded application (/) commands: ${response.length}`, 'rest');
    } catch (error) {
        log(`Error refreshing application (/) commands: ${error.message || error}`, 'rest');
    }
};

module.exports = deployCommands;
