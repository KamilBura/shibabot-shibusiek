// stopstalking.js
const { CommandInteraction, EmbedBuilder } = require('discord.js');
const { stalkingData, getStatusEmoji, getStatusText } = require('@functions/stalkingManager');

module.exports = {
    data: {
        name: 'stopstalking',
        description: 'Stop stalking a user',
        options: [
            {
                name: 'user',
                description: 'The user to stop stalking',
                type: 6,
                required: true,
            },
        ],
    },
    execute: async (interaction) => {
        const user = interaction.options.getUser('user');
    
        if (!user) {
            return interaction.reply('Invalid input. Please check your command.');
        }
    
        const stalkingInfo = stalkingData.get(user.id);
    
        if (!stalkingInfo || !stalkingInfo.stalkingInterval) {
            return interaction.reply('This user is not being stalked.');
        }
    
        const channel = interaction.guild.channels.cache.get(stalkingInfo.channelId);
    
        const existingMessage = stalkingInfo.messageId ? await channel.messages.fetch(stalkingInfo.messageId).catch(() => null) : null;
    
        if (existingMessage) {
            existingMessage.delete().catch(error => console.error('Error deleting message:', error));
        }
    
        const finalEmbed = new EmbedBuilder()
            .setColor('#ffcc00') // Shiba yellow color
            .setTitle(`${user.tag}'s Stalking Summary`)
            .setDescription(`Stalking has been manually stopped.`)
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: `ShibaBot Stalker | Stalking ended: ${new Date().toLocaleString()}` });
    
        stalkingInfo.presenceChanges.forEach(change => {
            finalEmbed.addFields({
                name: `Presence Change (${change.timestamp})`,
                value: `New Status: ${getStatusText(change.status)} {${getStatusEmoji(change.status)}}`
            });
        });
    
        channel.send({ embeds: [finalEmbed] });
    
        // Clear the interval and remove user from the collection
        clearInterval(stalkingInfo.stalkingInterval);
        stalkingData.delete(user.id);
    
        interaction.reply(`Stopped stalking ${user.tag}.`);
    },
};