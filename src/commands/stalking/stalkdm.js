// stalkdm.js
const { CommandInteraction, EmbedBuilder } = require('discord.js');
const { stalkingManager, stalkingData, stalkingCount } = require('../../functions/stalkingManager');
const config = require('../../config/config')

module.exports = {
    data: {
        name: 'stalkdm',
        description: 'Stalk a user and receive direct message notifications on status changes',
        options: [
            {
                name: 'user',
                description: 'The user to stalk',
                type: 6,
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

            const userToStalk = interaction.options.getUser('user');
            const duration = interaction.options.getString('duration');
            const interval = interaction.options.getInteger('interval');
            const stalkingUser = interaction.user;
            
            // Validate input
            if (!userToStalk || !duration || isNaN(interval) || interval < 2 || interval > 300) {
                return interaction.reply('Invalid input. Please check your command.');
            }
            
            // Check if the user is already being stalked
            if (stalkingData.has(userToStalk.id)) {
                return interaction.reply('This user is already being stalked.');
            }
            
            const userStalkCount = stalkingCount.get(interaction.user.id) || 0;
            if (userStalkCount >= 2) {
                const embed = new EmbedBuilder()
                .setColor('#ff0000') // Red color
                .setTitle('Maximum Stalk Count Reached')
                .setDescription(`You have reached the maximum allowed stalk count (2 users).`)
                .setFooter({ text: 'ShibaBot Stalker' });

                return interaction.reply({ embeds: [embed] });
            }

            // Get or create direct message channel with the user
            let dmChannel;
            try {
                dmChannel = await stalkingUser.createDM();
            } catch (error) {
                console.error(error);
                return interaction.reply('I encountered an error while trying to send you a direct message. Please try again later.');
            }
            
            // Stalk logic
            const isDM = true;
            stalkingManager(interaction.client, userToStalk.id, dmChannel.id, interaction.id, duration, interval, interaction.user.id, isDM); // Set isDM to true

            interaction.reply(`Started stalking ${userToStalk.tag} via direct message for ${duration} with an interval of ${interval} seconds.`);

        } catch {
            console.error('Error during /stalkdm or /stalk command:', 'error');
            interaction.reply('An error occurred. Please check your command and try again.');
        }
    },
};
    