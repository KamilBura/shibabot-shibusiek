// slashCommandHandler.js

const { log } = require('@functions/consoleLog');
const fs = require('fs');

const slashCommandHandler = (interaction) => {
    try {
        const commandName = interaction.commandName;

        // Check if the command exists
        const command = require(`@commands/${commandName}`);

        if (interaction.guild) {
            interaction.client.guildId = interaction.guild.id;
        }

        if (command) {
            log(`Executing command ${commandName} on Discord Server [${interaction.guild.name}]`, 'command');
            command.execute(interaction);
        } else {
            log(`Unknown command: ${commandName}`, 'warn');
            interaction.reply("Sorry, I don't recognize that command.");
        }
    } catch (error) {
        log(`Error executing command: ${error.message || error}`, 'error');
        interaction.reply('An error occurred while processing your command.');
    }
};

module.exports = slashCommandHandler;
