const { log } = require('../../functions/consoleLog');
const config = require('../../config/config');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    execute(oldState, newState, client) {
        try {
            const voiceLogId = config.ChannelsLogs.voiceLog;
            const logChannel = oldState.guild.channels.cache.get(voiceLogId);

            var date = Date.now();

            const voiceJoin = new EmbedBuilder()
                    .setColor(config.Embeds.colors.yellow)
                    .setAuthor({
                        name: `${newState.member.user.username} | Joined Voice`,
                        iconURL: newState.member.user.displayAvatarURL({ dynamic: true, size: 4096 }),
                    })
                    .setThumbnail(
                        "https://cdn.discordapp.com/attachments/1050740883319967764/1155814932999327814/1f50a.png"
                    )
                    .setDescription(
                        `<@${newState.member.user.id}> **joined** voice channel <#${newState.channel.id}>`
                    )
                    .addFields({ name: `When`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true });
    
            const voiceLeft = new EmbedBuilder()
                    .setColor(config.Embeds.colors.yellow)
                    .setAuthor({
                    name: `${newState.member.user.username} | Left Voice`,
                    iconURL: newState.member.user.displayAvatarURL({ dynamic: true, size: 4096 }),
                    })
                    .setThumbnail(
                    "https://cdn.discordapp.com/attachments/1050740883319967764/1155814932999327814/1f50a.png"
                    )
                    .setDescription(
                    `<@${oldState.member.user.id}> **left** voice channel <#${oldState.channel.id}>`
                    )
                    .addFields({ name: `When`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true });

            const voiceSelfMute = new EmbedBuilder()
                    .setColor(config.Embeds.colors.yellow)
                    .setAuthor({
                    name: `${newState.member.user.username} | Muted Themselves`,
                    iconURL: newState.member.user.displayAvatarURL({ dynamic: true, size: 4096 }),
                    })
                    .setThumbnail(
                    "https://cdn.discordapp.com/attachments/1050740883319967764/1155814932999327814/1f50a.png"
                    )
                    .setDescription(
                    `<@${newState.member.user.id}> has **muted** themselves in channel <#${newState.channel.id}>`
                    )
                    .addFields({ name: `When`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true });

            const voiceSelfUnmute = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({
                    name: `${newState.member.user.username} | Unmuted Themselves`,
                    iconURL: newState.member.user.displayAvatarURL({ dynamic: true, size: 4096 }),
                    })
                    .setThumbnail(
                    "https://cdn.discordapp.com/attachments/1050740883319967764/1155814932999327814/1f50a.png"
                    )
                    .setDescription(
                    `<@${newState.member.user.id}> has **unmuted** themselves in channel <#${newState.channel.id}>`
                    )
                    .addFields({ name: `When`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true });

            const voiceSelfDeaf = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({
                      name: `${newState.member.user.username} | Deafended Themselves`,
                      iconURL: newState.member.user.displayAvatarURL({ dynamic: true, size: 4096 }),
                    })
                    .setThumbnail(
                      "https://cdn.discordapp.com/attachments/1050740883319967764/1155814932999327814/1f50a.png"
                    )
                    .setDescription(
                      `<@${newState.member.user.id}> has **deafened** themselves in channel <#${newState.channel.id}>`
                    )
                    .addFields({ name: `When`, value: `<t:${parseInt(date / 1000)}:R>`, inline: true });
          
        try {
            if (!oldState.channelId && newState.channelId) {
                logChannel.send({ embeds: [voiceJoin] });
            } else if (oldState.channelId && !newState.channelId) {
                logChannel.send({ embeds: [voiceLeft] });
            } else if (oldState.serverMute !== newState.serverMute) {
                logChannel.send({ embeds: [voiceSelfMute] });
            } else if (oldState.selfMute !== newState.selfMute) {
                logChannel.send({ embeds: [voiceSelfUnmute] });
            } else if (oldState.selfDeaf !== newState.selfDeaf) {
                logChannel.send({ embeds: [voiceSelfDeaf] });
            }
            
            } catch (error) {
                console.error(error);
                log({ text: `An error occurred while logging voiceStateUpdate event ${error}`});
            }
        } catch (error) {
            console.error(error);
            log({ text: `An error occurred while logging voiceStateUpdate event ${error}`});
        }
    },
};
