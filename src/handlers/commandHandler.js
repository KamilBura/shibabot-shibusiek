// src/handlers/commandHandler.js

const { log } = require('../functions/consoleLog');
const fs = require('fs');
const path = require('path');

const findCommandFile = (commandName) => {
    const commandFolders = fs.readdirSync(path.resolve(__dirname, `../commands/`));

    for (const folder of commandFolders) {
        const folderPath = path.resolve(__dirname, `../commands/${folder}`);
        if (fs.statSync(folderPath).isDirectory()) {
            const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const commandFileName = path.parse(file).name;
                if (commandFileName === commandName) {
                    return path.resolve(folderPath, file);
                }
            }
        }
    }

    return null;
};

const commandHandler = (interaction) => {
    try {
        const commandName = interaction.commandName;

        // Find the correct command file
        const commandFile = findCommandFile(commandName);

        // Check if the command file exists
        if (commandFile) {
            const command = require(commandFile);

            if (interaction.guild) {
                interaction.client.guildId = interaction.guild.id;
            }

            log(`Executing command ${commandName} on Discord Server [${interaction.guild.name}]`, 'command');
            command.execute(interaction, interaction.client, interaction.args);
        } else {
            log(`Unknown command: ${commandName}`, 'warn');
            interaction.reply("Sorry, I don't recognize that command.");
        }
    } catch (error) {
        log(`Error executing command: ${error.message || error}`, 'error');
        interaction.reply('An error occurred while processing your command.');
    }
};

module.exports = commandHandler;
