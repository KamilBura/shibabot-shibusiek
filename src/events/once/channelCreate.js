const { log } = require('../../functions/consoleLog');
const config = require('../../config/config');
const { EmbedBuilder } = require('discord.js'); // Updated import

module.exports = {
    name: 'channelCreate',
    once: false,
    execute(channel) {
        try {
            if (channel.type === 0) {
                const channelLogId = config.ChannelsLogs.channelLog;

                const logChannel = channel.guild.channels.cache.get(channelLogId);

                if (logChannel) {
                    const channelCreate = new EmbedBuilder() // Updated to EmbedBuilder
                        .setColor(config.Embeds.colors.green)
                        .setAuthor({
                            name: `${channel.client.user.username} | New Channel Created`, // Updated to channel.client.user.username
                            iconURL: channel.client.user.displayAvatarURL({ size: 4096 }), // Updated to channel.client.user.displayAvatarURL
                        })
                        .setThumbnail(
                            "https://cdn.discordapp.com/emojis/1138482145673871400.webp?size=96&quality=lossless"
                        )
                        .addFields(
                            { name: `Name`, value: `${channel.name}`, inline: true },
                            { name: `ID`, value: `${channel.id}`, inline: true },
                            { name: `Mention`, value: `<#${channel.id}>`, inline: true },
                            {
                                name: `NSFW`,
                                value: `${channel.nsfw ? "Yes :white_check_mark:" : "No :x:"}`,
                                inline: true,
                            },
                            {
                                name: `Channel Category`,
                                value: `${channel.parent.name}`,
                                inline: true,
                            },
                            {
                                name: `Created`,
                                value: `<t:${parseInt(channel.createdAt / 1000)}:R>`,
                                inline: true,
                            }
                        );

                    logChannel.send({ embeds: [channelCreate] });
                    log('Channel create event logged successfully.', 'events');
                } else {
                    log({ text: 'Channel log channel not found'}, 'events');
                }
            }
        } catch (error) {
            console.error(error);
            log({ text: `An error occurred while logging channel create event ${error}` });
        }
    },
};
