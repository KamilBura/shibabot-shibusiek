// slashCommandHandler.js

const { log } = require('@functions/consoleLog');
const embeds = require('@helpers/embeds');

const sendErrorEmbed = (interaction, errorMessage) => {
    interaction.reply({ embeds: [embeds.error(errorMessage)] }).catch(console.error);
};

const slashCommandHandler = async (interaction) => {
    try {
        const commandName = interaction.commandName;

        // Check if the command exists
        const command = require(`@commands/${commandName}`);

        if (interaction.guild) {
            interaction.client.guildId = interaction.guild.id;
        }

        if (command) {
            log(`Executing command ${commandName} on Discord Server [${interaction.guild.name}]`, 'command');
            await command.execute(interaction);
        } else {
            log(`Unknown command: ${commandName}`, 'warn');
            sendErrorEmbed(interaction, "Sorry, I don't recognize that command.");
        }
    } catch (error) {
        log(`Error executing command: ${error.message || error}`, 'error');
        sendErrorEmbed(interaction, 'An error occurred while processing your command.');
    }
};

module.exports = slashCommandHandler;
