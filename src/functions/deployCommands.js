const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { log } = require('./consoleLog');
const fs = require('fs');
const path = require('path');

const deployCommands = async (clientId, guildId, token) => {
    const rest = new REST({ version: '9' }).setToken(token);

    const commands = [];
    const commandFolders = fs.readdirSync('./src/commands/');

    for (const folder of commandFolders) {
        const folderPath = path.join('./src/commands/', folder);
        if (fs.statSync(folderPath).isDirectory()) {
            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                if (command.data) {
                    commands.push(command.data);
                }
            }
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