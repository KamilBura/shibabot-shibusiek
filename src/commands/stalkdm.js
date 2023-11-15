const { CommandInteraction, EmbedBuilder } = require('discord.js');
const { stalkingManager, stalkingData } = require('@functions/stalkingManager');

module.exports = {
    data: {
        name: 'stalkdm',
        description: 'Stalk a user and receive DM notifications on status changes',
        options: [
            {
                name: 'user',
                description: 'The user to stalk',
                type: 6,
                required: true,
            },
            {
                name: 'duration',
                description: 'Duration to stalk the user in hours (max. 48 hours)',
                type: 4,
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
        const user = interaction.options.getUser('user');
        const duration = interaction.options.getInteger('duration');
        const interval = interaction.options.getInteger('interval');

        if (!user || isNaN(duration) || duration < 1 || duration > 48 || isNaN(interval) || interval < 2 || interval > 300) {
            return interaction.reply('Invalid input. Please check your command.');
        }

        if (stalkingData.has(user.id)) {
            return interaction.reply('This user is already being stalked.');
        }

        const userDMChannel = await user.createDM();
        stalkingManager(interaction.client, user.id, userDMChannel.id, duration, interval);

        interaction.reply(`Started stalking ${user.tag} in DM for ${duration} hours with an interval of ${interval} seconds.`);
    },
};