const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const deployCommands = async (clientId, guildId, token) => {
    const rest = new REST({ version: '9' }).setToken(token);

    try {
        console.log('Started deleting existing application (/) commands.');

        const deleteRoute = guildId
            ? Routes.applicationGuildCommands(clientId, guildId)
            : Routes.applicationCommands(clientId);

        await rest.delete(deleteRoute);

        console.log('Successfully deleted existing application (/) commands.');
    } catch (error) {
        console.error('Error deleting existing application (/) commands:', error.message || error);
    }

    const commands = [];
    const commandFiles = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        
        if (command.data) {
            commands.push(command.data);
        }
    }

    try {
        console.log('Started refreshing application (/) commands.');

        const putRoute = guildId
            ? Routes.applicationGuildCommand(clientId, guildId)
            : Routes.applicationCommands(clientId);

            const response = await rest.put(putRoute, { body: commands });
            
        console.log('Successfully reloaded application (/) commands:', response);
    } catch (error) {
        console.error('Error refreshing application (/) commands:', error.message || error);
    }
};

module.exports = deployCommands;
