// stopstalking.js
const { CommandInteraction, EmbedBuilder } = require('discord.js');
const { stalkingData, getStatusEmoji, getStatusText, decrementStalkCount } = require('../../functions/stalkingManager');
const { log } = require('../../functions/consoleLog');

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

        try {

            const user = interaction.options.getUser('user');
            
            if (!user) {
                return interaction.reply('Invalid input. Please check your command.');
            }
            
            const stalkingInfo = stalkingData.get(user.id);
            
            if (!stalkingInfo || !stalkingInfo.stalkingInterval) {
                return interaction.reply('This user is not being stalked.');
            }
            
            try {
                let channel;
                
                if (stalkingInfo.channelId === 'dm') {
                    // If it's a DM, use user.dmChannel
                    channel = user.dmChannel;
                } else {
                    // If it's a guild channel, fetch the channel
                    channel = await interaction.client.channels.fetch(stalkingInfo.channelId);
                }
                
                const existingMessage = stalkingInfo.messageId ? await channel.messages.fetch(stalkingInfo.messageId).catch(() => null) : null;
                
                if (existingMessage) {
                    await existingMessage.delete();
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
                
                await channel.send({ embeds: [finalEmbed] });
                
                // Clear the interval and remove user from the collection
                clearInterval(stalkingInfo.stalkingInterval);
                stalkingData.delete(user.id);

                decrementStalkCount(interaction.user.id);
                
                interaction.reply(`Stopped stalking ${user.tag}.`);

            } catch (error) {   
                log('Error during /stopstalking command:', 'error');
                interaction.reply('An error occurred while trying to stop stalking. Please try again later.');
            }

        } catch (error) {
            log('Error during /stopstalking command:', 'error');
            interaction.reply('An error occurred while trying to stop stalking. Please try again later.');
        }
    },
};