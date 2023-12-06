const { log } = require('../../functions/consoleLog');
const config = require('../../config/config');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'channelDelete',
    once: false,
    execute(channel) {
        try {
            if (channel.type === 0) {
                const channelLogId = config.ChannelsLogs.channelLog;

                const logChannel = channel.guild.channels.cache.get(channelLogId);

                if (logChannel) {
                    const channelDelete = new EmbedBuilder()
                    .setColor(config.Embeds.colors.red)
                    .setAuthor({
                      name: `${channel.client.user.username} | Channel Deleted`,
                      iconURL: channel.client.user.displayAvatarURL({ size: 4096 }),
                    })
                    .setThumbnail(
                      "https://cdn.discordapp.com/emojis/1138482145673871400.webp?size=96&quality=lossless"
                    )
                    .setDescription(`:white_check_mark: Channel **#${channel.name}** has been deleted`)
                    .addFields(
                      { name: `Name`, value: `${channel.name}`, inline: true },
                      { name: `ID`, value: `${channel.id}`, inline: true },
                      {
                        name: `NSFW`,
                        value: `${channel.nsfw ? "Yes :white_check_mark:" : "No :x:"}`,
                        inline: true,
                      }
                    );

                    logChannel.send({ embeds: [channelDelete] });
                    log('Channel delete event logged successfully.', 'events');
                } else {
                    log({ text: 'Channel log channel not found'}, 'events');
                }
            }
        } catch (error) {
            console.error(error);
            log({ text: `An error occurred while logging channel delete event ${error}`});
        }
    },
};