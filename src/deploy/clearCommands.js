const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { log } = require('../functions/consoleLog');
const { Bot } = require('../config/config');

const rest = new REST({ version: '9' }).setToken(Bot.token);

const clearCommands = async () => {
    try {
        const clearRoute = Routes.applicationCommands(Bot.clientID);

        await rest.put(clearRoute, { body: [] });
        log(`Successfully deleted existing application (/) commands.`, 'rest');
    } catch (error) {
        log(`Error deleting application (/) commands: ${error.message || error}`, 'rest');
    }
};

clearCommands();