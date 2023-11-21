// src/commands/stalk.js

const { CommandInteraction, EmbedBuilder } = require('discord.js');
const { stalkingManager, stalkingData, stalkingCount, incrementStalkCount } = require('@functions/stalkingManager');
const config = require('@config/config');

module.exports = {
    data: {
        name: 'stalk',
        description: 'Stalk a user and receive notifications on status changes',
        options: [
            {
                name: 'user',
                description: 'The user to stalk',
                type: 6,
                required: true,
            },
            {
                name: 'channel',
                description: 'The channel to send notifications to',
                type: 7,
                required: true,
            },
            {
                name: 'duration',
                description: 'Duration to stalk the user (e.g., "1h", "20m")',
                type: 3,
                required: true,
            }, 
            {
                name: 'interval',
                description: 'Interval to check the user\'s status in seconds (min. 2 [2seconds], max. 300 [5 minutes])',
                type: 4,
                required: true,
            },
        ],
    },
    execute: async (interaction) => {
        try {

            const user = interaction.options.getUser('user');
            const channel = interaction.options.getChannel('channel');
            const duration = interaction.options.getString('duration');
            const interval = interaction.options.getInteger('interval');
            
            // Validate input
            if (!user || !channel || !duration || isNaN(interval) || interval < 2 || interval > 300) {
                return interaction.reply('Invalid input. Please check your command.');
            }

            // Check if the person has reached the maximum allowed stalk count
            const userStalkCount = stalkingCount.get(interaction.user.id) || 0;
            if (userStalkCount >= 2) {
                const embed = new EmbedBuilder()
                .setColor('#ff0000') // Red color
                .setTitle('Maximum Stalk Count Reached')
                .setDescription(`You have reached the maximum allowed stalk count (2 users).`)
                .setFooter({ text: 'ShibaBot Stalker' });

                return interaction.reply({ embeds: [embed] });
            }
            
            // Check if the user is already being stalked
            if (stalkingData.has(user.id)) {
                return interaction.reply('This user is already being stalked.');
            }
            
            // Stalk logic
            stalkingManager(interaction.client, user.id, channel.id, interaction.id, duration, interval, interaction.user.id);

            interaction.reply(`Started stalking ${user.tag} in ${channel.toString()} for ${duration} with an interval of ${interval} seconds.`);
        } catch (error) {
            console.error('Error during /stalk command:', error);
            interaction.reply('An error occurred. Please check your command and try again.');
        }
    },
};