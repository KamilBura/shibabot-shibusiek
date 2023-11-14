// src/commands/stalk.js

const { CommandInteraction, EmbedBuilder } = require('discord.js');
const { stalkingManager, stalkingData } = require('@functions/stalkingManager');

module.exports = {
    data: {
        name: 'stalk',
        description: 'Stalk a user and receive notifications on status changes',
        options: [
            {
                name: 'user',
                description: 'The user to stalk',
                type: 'USER',
                required: true,
            },
            {
                name: 'channel',
                description: 'The channel to send notifications to',
                type: 'CHANNEL',
                required: true,
            },
            {
                name: 'duration',
                description: 'Duration to stalk the user in hours (max. 48 hours)',
                type: 'INTEGER',
                required: true,
            },
        ],
    },
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const channel = interaction.options.getChannel('channel');
        const duration = interaction.options.getInteger('duration');

        // Validate input
        if (!user || !channel || isNaN(duration) || duration < 1 || duration > 48) {
            return interaction.reply('Invalid input. Please check your command.');
        }

        // Check if the user is already being stalked
        if (stalkingData.has(user.id)) {
            return interaction.reply('This user is already being stalked.');
        }

        // Stalk logic
        stalkingManager(interaction.client, user.id, channel.id, duration);

        interaction.reply(`Started stalking ${user.tag} in ${channel.toString()} for ${duration} hours.`);
    },
};