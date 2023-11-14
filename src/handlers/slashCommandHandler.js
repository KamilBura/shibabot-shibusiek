const { log } = require('@functions/consoleLog');
const fs = require('fs');

const slashCommandHandler = (interaction) => {
    const commandName = interaction.commandName;

    // Check if the command exists
    const command = require(`@commands/${commandName}`);

    if (interaction.guild) {
        interaction.client.guildId = interaction.guild.id;
    }
    
    if (command) {
        log(`Executing command ${commandName} on Discord Server [${interaction.guild.name}]`, 'info');
        command.execute(interaction);
    } else {
        log(`Unknown command: ${commandName}`, 'warn');
    }
};

module.exports = slashCommandHandler;
