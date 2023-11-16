// src/commands/activestalk.js

const { CommandInteraction, EmbedBuilder } = require('discord.js');
const { stalkingData, getStatusText, getStatusEmoji } = require('@functions/stalkingManager');

module.exports = {
    data: {
        name: 'activestalk',
        description: 'Show active running stalks',
    },
    execute: async (interaction) => {
        // Check if there are any active stalks
        if (stalkingData.size === 0) {
            return interaction.reply('No active stalks currently.');
        }

        // Create an embed to display active stalks
        const embed = new EmbedBuilder()
            .setColor('#00ff00') // Green color
            .setTitle('Active Stalks')
            .setDescription('List of currently active stalks');

        // Use for...of loop to ensure proper handling of asynchronous operations
        for (const [userId, stalkingInfo] of stalkingData) {
            try {
                const user = await interaction.client.users.fetch(userId);
                const member = await interaction.guild.members.fetch(userId);

                if (user && member) {
                    const intervalText = stalkingInfo.interval !== undefined ? `${stalkingInfo.interval} seconds` : 'Not specified';
                    const startedByText = interaction.user.tag || 'Unknown';

                    embed.addFields({
                        name: `${user.tag}`,
                        value: `Status Now: ${getStatusText(member?.presence?.status || 'offline')} ${getStatusEmoji(member?.presence?.status || 'offline')}\nRemaining Duration: ${stalkingInfo.duration}\nInterval: ${intervalText}\nStarted by: ${startedByText}`,
                        inline: false,
                    });
                } else {
                    // Handle cases where user or member is undefined
                    embed.addFields({
                        name: 'Error',
                        value: `Unable to fetch information for user with ID ${userId}`,
                        inline: false,
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }

        // Send the embed with active stalks
        interaction.reply({ embeds: [embed] });
    },
};
