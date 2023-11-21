// src/commands/client/help.js

const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: {
        name: 'help',
        description: 'Show available commands and their descriptions',
    },
    execute: async (interaction, client, args) => {
        try {
            const { commandInfo } = require('@handlers/slashCommandHandler');
            const commandCategories = require('@helpers/commandCategories');

            if (!commandInfo) {
                console.error('commandInfo is undefined. Commands might not have been loaded correctly.');
                interaction.reply('An error occurred while processing your command.');
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle('📃 Command List')
                .setColor('#55acee') // Change the color to a more appealing one, you can use any valid color code
                .setDescription('Here are the available commands and their descriptions:')
                .setThumbnail(client.user.displayAvatarURL()) // Set the bot's avatar as the thumbnail

            for (const [name, description] of commandInfo) {
                const categoryEmoji = commandCategories.COMMANDS[name.toLowerCase()];
                embed.addFields({ name: `${categoryEmoji ? categoryEmoji + ' ' : ''}${name}`, value: description, inline: true }); // Set the inline parameter to true for inline fields
            }

            embed.setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL()});

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while processing your command.');
        }
    },
};
