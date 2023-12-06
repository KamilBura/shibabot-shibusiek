const { log } = require('../../functions/consoleLog');
const config = require('../../config/config');
const { EmbedBuilder } = require('discord.js');


module.exports = {
    name: 'channelPinsUpdate',
    once: false,
    execute(channel) {
        try {
            if (channel.type === 0) {
                const channelLogId = config.ChannelsLogs.channelLog;

                const logChannel = channel.guild.channels.cache.get(channelLogId);

                if (logChannel) {
                    var date = Date.now();

                    const channelPins = new EmbedBuilder()
                      .setColor(config.Embeds.colors.blue)
                      .setAuthor({
                        name: `${channel.client.user.username} | Channel Pins Update`,
                        iconURL: channel.client.user.displayAvatarURL({ size: 4096 }),
                      })
                      .setThumbnail(
                        "https://cdn.discordapp.com/emojis/1138483813694046339.webp?size=96&quality=lossless"
                      )
                      .setDescription(`:pushpin: Message has been pinned or unpinned`)
                      .addFields(
                        { name: `In Channel`, value: `<#${channel.id}>`, inline: true },
                        { name: `Channel ID`, value: `${channel.id}`, inline: true },
                        { name: `When`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true }
                      );

                    logChannel.send({ embeds: [channelPins] });
                    log('Channel pins up event logged successfully.', 'events');
                } else {
                    log({ text: 'Channel log channel not found'}, 'events');
                }
            }
        } catch (error) {
            console.error(error);
            log({ text: `An error occurred while logging channel pins up event ${error}`});
        }
    },
};