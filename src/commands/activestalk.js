const { CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { stalkingData } = require('@functions/stalkingManager');

module.exports = {
    data: {
        name: 'activestalk',
        description: 'Show currently active stalkers in this server',
    },
    execute: async (interaction) => {
        const activeStalkers = stalkingData.filter(data => data.channelId === interaction.channelId);

        if (activeStalkers.size === 0) {
            return interaction.reply('No stalkers are currently active in this server.');
        }

        const rows = [];
        const buttons = [];

        activeStalkers.forEach((data, userId) => {
            const member = interaction.guild.members.cache.get(userId);

            if (member) {
                const button = new ButtonBuilder()
                    .setCustomId(`view_stalker_${userId}`)
                    .setLabel(user.tag)
                    .setStyle('PRIMARY');
    
                    button.push(button);
    
                    if (buttons.length === 5) {
                        rows.push(new ActionRowBuilder().addComponents([...buttons]));
                        buttons.length = 0;
                    }
            }
        });

        if (buttons.length > 0) {
            rows.push(new ActionRowBuilder().addComponents([...buttons]));
        }

        interaction.reply({ content: 'Active Stalkers:', components: rows });
    },
};