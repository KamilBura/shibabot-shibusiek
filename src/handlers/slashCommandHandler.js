// src/handlers/slashCommandHandler.js

const { log } = require('@functions/consoleLog');
const embeds = require('@helpers/embeds');
const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js'); // Import Collection
const { loadCommands } = require('@handlers/commandHandler'); // New import

// Initialize a Collection to store loaded commands
const commands = new Collection();
// Initialize a Collection to store command names and descriptions
const commandInfo = new Collection();

const sendErrorEmbed = (interaction, errorMessage) => {
    interaction.reply({ embeds: [embeds.error(errorMessage)] }).catch(console.error);
};

// Load commands before starting the bot
loadCommands(commands, commandInfo);

const slashCommandHandler = (interaction) => {
    try {
        const commandName = interaction.commandName;

        // Check if the command exists in the loaded commands
        const command = commands.get(commandName);

        if (command) {
            if (interaction.guild) {
                interaction.client.guildId = interaction.guild.id;
            }

            log(`Executing command ${commandName} on Discord Server [${interaction.guild.name}]`, 'command');
            command.execute(interaction, interaction.client);
        } else {
            log(`Unknown command: ${commandName}`, 'warn');
            interaction.reply("Sorry, I don't recognize that command.");
        }
    } catch (error) {
        log(`Error executing command: ${error.message || error}`, 'error');
        interaction.reply('An error occurred while processing your command.');
    }
};

module.exports = { slashCommandHandler, commandInfo }; // Export commandInfo along with slashCommandHandler
